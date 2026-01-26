(function(global){
    'use strict';

    // ------------------------------------------------------------------
    //  Paper Generator V9.9 (The "Missing Key" Fix)
    //  修復：idMap 缺失導致地理/公民被過濾的問題 + 強制保底機制
    // ------------------------------------------------------------------

    if (!Array.prototype.shuffle) {
        Array.prototype.shuffle = function() {
            for (let i = this.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this[i], this[j]] = [this[j], this[i]];
            }
            return this;
        };
    }

    function generatePaper(config) {
        // 1. 取得或建立主引擎
        let G = window.RigorousGenerator || global.RigorousGenerator;
        if (!G) {
            G = window.RigorousGenerator = { 
                _templates: {}, 
                registerTemplate: function(id, f, t){ 
                    this._templates[id] = {func:f, tags:t, subject: f.subject || 'misc'}; 
                } 
            };
        }
        if (!G.getTemplateIds) G.getTemplateIds = () => Object.keys(G._templates || {});

        const subject = (config.subject || 'math').toLowerCase();
        
        // ============================================================
        // 1. 全面掃描避難所 (Universal Repo Scan)
        // ============================================================
        const repoMap = [
            { name: 'chinese',   repo: window.__CHINESE_REPO__ },
            { name: 'math',      repo: window.__MATH_REPO__ },
            { name: 'english',   repo: window.__ENGLISH_REPO__ },
            { name: 'physics',   repo: window.__PHYSICS_REPO__ },
            { name: 'chemistry', repo: window.__CHEMISTRY_REPO__ },
            { name: 'biology',   repo: window.__BIOLOGY_REPO__ },
            { name: 'history',   repo: window.__HISTORY_REPO__ },
            { name: 'geography', repo: window.__GEOGRAPHY_REPO__ }, // 這裡有讀到
            { name: 'earth',     repo: window.__EARTH_SCI_REPO__ }, // 修正：Earth Science
            { name: 'civics',    repo: window.__CIVICS_REPO__ }     // 這裡有讀到
        ];

        repoMap.forEach(item => {
            if (item.repo) {
                const repoIds = Object.keys(item.repo);
                let restored = 0;
                repoIds.forEach(id => {
                    if (!G._templates[id]) {
                        const data = item.repo[id];
                        G._templates[id] = {
                            func: data.func,
                            tags: data.tags || [],
                            meta: data.tags || [],
                            subject: data.subject || item.name
                        };
                        restored++;
                    }
                });
                if(restored > 0) console.log(`🚑 [Gen V9.9] 從 ${item.name} 還原 ${restored} 題`);
            }
        });

        // ============================================================
        // 2. 關鍵字映射 (這是之前壞掉的地方！)
        // ============================================================
        const idMap = {
            'chinese':   ['chi_', 'chinese', '國文'],
            'math':      ['math', 'alg', 'geo_', '數學'], // geo_ 容易跟地理搞混，要注意
            'english':   ['eng', 'gram', 'vocab', '英文'],
            'physics':   ['phy', '物理', '理化'],
            'chemistry': ['chem', '化學', '理化'],
            'biology':   ['bio', '生物'],
            'earth':     ['earth', '地科'],
            'history':   ['his', 'hist', '歷史'],
            // ★★★ 之前就是少了下面這兩行！ ★★★
            'geography': ['geo_', 'geography', '地理'], 
            'civics':    ['civ', 'civics', '公民', '社會']
        };

        // 處理特殊情況：math 的 geo (幾何) 和 geography 的 geo
        let subjectKeywords = idMap[subject] || [subject];
        if (subject === 'math') {
            subjectKeywords = subjectKeywords.filter(k => k !== 'geo_'); // 數學移除 geo_ 避免抓到地理
        }

        const requestTags = (Array.isArray(config.tags) ? config.tags : [config.tags])
                            .map(t => String(t).toLowerCase());
        const allTemplateIds = G.getTemplateIds();

        console.log(`🔒 [Gen V9.9] 請求: 科目[${subject}] 標籤[${requestTags}]`);

        // ============================================================
        // 3. 篩選邏輯 (分數制)
        // ============================================================
        let candidates = [];

        allTemplateIds.forEach(tid => {
            const t = G._templates[tid];
            if (!t) return;

            const tidLower = tid.toLowerCase();
            const rawTags = t.tags || t.meta || (t.func && t.func.tags) || [];
            const tSubject = (t.subject || (t.func && t.func.subject) || "").toLowerCase();
            
            // 建立該題目的所有關鍵字池
            const metaPool = (Array.isArray(rawTags) ? rawTags : [rawTags])
                             .concat([tSubject])
                             .map(x => String(x).toLowerCase());

            let score = 0;

            // A. 科目絕對過濾 (Subject Guard)
            // 如果題目的 subject 屬性存在且與請求不符，直接踢除
            // (防止把物理題當化學題)
            if (tSubject && tSubject !== 'misc' && tSubject !== subject) {
                // 特例：earth 可能對應 earth_science
                if (!(subject === 'earth' && tSubject === 'earth_science')) {
                    return; 
                }
            }

            // B. ID 關鍵字加分 (ID Match)
            const isIdMatch = subjectKeywords.some(kw => tidLower.includes(kw));
            if (isIdMatch) score += 1;

            // C. 標籤加分 (Tag Match)
            requestTags.forEach(reqTag => {
                if (metaPool.some(mt => mt.includes(reqTag) || reqTag.includes(mt))) {
                    score += 10; // 標籤命中權重很高
                }
            });

            // 如果有分數，或科目完全正確，就加入候選
            if (score > 0 || tSubject === subject) {
                candidates.push({ tid: tid, score: score });
            }
        });

        // 排序：高分優先
        candidates.sort((a, b) => b.score - a.score);

        // ============================================================
        // 4. 強制保底 (Fallback)
        // ============================================================
        if (candidates.length === 0) {
            console.warn(`⚠️ [Gen V9.9] 標籤篩選結果為 0！啟動「同科目強制保底」...`);
            // 只要科目對，不管標籤了，全部抓進來
            allTemplateIds.forEach(tid => {
                const t = G._templates[tid];
                const tSub = (t.subject || "").toLowerCase();
                if (tSub === subject || (subject==='earth' && tSub==='earth_science')) {
                    candidates.push({ tid: tid, score: 1 });
                }
            });
            // 隨機打亂保底題目
            candidates.shuffle();
        }

        console.log(`📊 最終候選: ${candidates.length} 題`);

        // ============================================================
        // 5. 生成考卷
        // ============================================================
        const paper = [];
        const total = config.total || 10;
        let count = 0;
        
        for (let i = 0; i < candidates.length && count < total; i++) {
            const tid = candidates[i].tid;
            try {
                let q = null;
                if (typeof G.generateQuestion === 'function') {
                    q = G.generateQuestion(tid, { tags: requestTags });
                } else {
                    const tmpl = G._templates[tid];
                    if (tmpl && tmpl.func) q = tmpl.func({}, Math.random);
                }
                if (q) { paper.push(q); count++; }
            } catch (e) {
                console.warn(`[Skip] ${tid} error:`, e);
            }
        }

        return paper;
    }

    window.generatePaper = generatePaper;
    console.log("✅ Paper Generator V9.9 (Keyword Fix) 已修復地理/公民問題");

})(window);
