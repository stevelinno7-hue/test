(function(global){
    'use strict';

    // ------------------------------------------------------------------
    //  Paper Generator V10.0 (Smart Adapter)
    //  新增功能：同義詞自動擴充 (國七 <=> 七年級)
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

    // 自動初始化核心
    if (!window.RigorousGenerator) {
        window.RigorousGenerator = { 
            _templates: {}, 
            registerTemplate: function(id, f, t){ 
                this._templates[id] = {func:f, tags:t, subject: f.subject || 'misc'}; 
            } 
        };
    }

    // ✨✨✨ 關鍵修改：標籤清洗與同義詞擴充 ✨✨✨
    function normalizeTags(raw) {
        if (!raw) return [];
        
        let tags = [];
        // 1. 初步解析 (字串切分或陣列處理)
        if (typeof raw === 'string') {
            tags = raw.split(/[,，\s]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
        } else if (Array.isArray(raw)) {
            tags = raw.map(t => String(t).trim().toLowerCase()).filter(Boolean);
        }

        // 2. 同義詞擴充 (Synonym Expansion)
        // 讓 "國七" 能對應 "七年級"，"高一" 能對應 "十年級" 等
        const expandedTags = [];
        
        tags.forEach(t => {
            expandedTags.push(t); // 加入原始標籤

            // 國中同義詞
            if (t === '國七' || t === '七年級' || t === 'grade7') {
                expandedTags.push('國七', '七年級', 'grade7');
            }
            if (t === '國八' || t === '八年級' || t === 'grade8') {
                expandedTags.push('國八', '八年級', 'grade8');
            }
            if (t === '國九' || t === '九年級' || t === 'grade9') {
                expandedTags.push('國九', '九年級', 'grade9');
            }

            // 高中同義詞
            if (t === '高一' || t === '十年級' || t === 'grade10') {
                expandedTags.push('高一', '十年級', 'grade10');
            }
            if (t === '高二' || t === '十一年級' || t === 'grade11') {
                expandedTags.push('高二', '十一年級', 'grade11');
            }
            if (t === '高三' || t === '十二年級' || t === 'grade12') {
                expandedTags.push('高三', '十二年級', 'grade12');
            }
        });

        // 3. 去除重複 (使用 Set)
        return [...new Set(expandedTags)];
    }

    function generatePaper(config) {
        let G = window.RigorousGenerator;
        if (!G) G = window.RigorousGenerator = { _templates: {} };
        if (!G.getTemplateIds) G.getTemplateIds = () => Object.keys(G._templates || {});

        const subject = (config.subject || 'math').toLowerCase();
        
        // 1. 清洗使用者請求的標籤 (現在會自動擴充同義詞)
        const requestTags = normalizeTags(config.tags);

        console.log(`🔒 [Gen V10.0] 智慧匹配模式 | 科目: ${subject}`);
        console.log(`🎯 請求標籤 (含同義詞):`, requestTags);

        // 2. 收集所有題目來源
        const repos = [
            window.__MATH_REPO__, window.__PHYSICS_REPO__, window.__CHEMISTRY_REPO__, 
            window.__BIOLOGY_REPO__, window.__EARTH_SCI_REPO__, window.__CHINESE_REPO__,
            window.__ENGLISH_REPO__, window.__HISTORY_REPO__, window.__CIVICS_REPO__, window.__GEOGRAPHY_REPO__
        ];

        let candidates = [];
        let debugTagPool = new Set(); 

        repos.forEach(repo => {
            if(!repo) return;
            Object.keys(repo).forEach(tid => {
                const t = repo[tid];
                if (!t) return;
                
                // --- A. 科目檢查邏輯 ---
                const tSubject = String(t.subject || "").toLowerCase().trim();
                let isSubjectMatch = false;

                // 理化聯集池
                const sciencePool = ['physics', 'chemistry', 'science', '理化', '物理', '化學', '自然'];

                if (subject === 'science') {
                    if (sciencePool.some(s => tSubject.includes(s))) {
                        isSubjectMatch = true;
                    } else {
                        const rawTagsForSub = normalizeTags(t.tags || t.meta || []);
                        if (rawTagsForSub.some(tag => ['理化', '化學', '物理'].includes(tag))) isSubjectMatch = true;
                    }
                } 
                // 其他科目精準比對
                else if (tSubject.includes(subject) || subject.includes(tSubject)) {
                    isSubjectMatch = true;
                }

                if (!isSubjectMatch) return;

                // --- B. 標籤智慧比對 ---
                let score = 0;
                
                // 題目的標籤也經過同樣的清洗與擴充
                const rawTags = t.tags || t.meta || (t.func && t.func.tags) || [];
                const metaTags = normalizeTags(rawTags).concat([tSubject]);

                metaTags.forEach(mt => debugTagPool.add(mt));

                if (requestTags.length === 0) {
                    score = 1; // 沒選標籤 = 全冊
                } else {
                    let hitCount = 0;
                    requestTags.forEach(rt => {
                        // 只要有任何一個標籤對上即可
                        if (metaTags.includes(rt)) {
                            hitCount++;
                        }
                    });
                    
                    if (hitCount > 0) {
                        score = 10 + hitCount;
                    } else {
                        score = 0; 
                    }
                }

                // --- C. 加入候選 ---
                if (score > 0) {
                    candidates.push({ 
                        tid: tid, 
                        score: score + Math.random(), 
                        func: t.func,
                        debugTags: metaTags 
                    });
                }
            });
        });

        // 3. 排序
        candidates.sort((a, b) => b.score - a.score);

        console.log(`📊 篩選結果: 找到 ${candidates.length} 題符合條件`);
        
        // 4. 診斷報告
        if (candidates.length === 0) {
            console.error("❌ 找不到題目！");
            console.warn("🧐 題庫中現有的標籤:", Array.from(debugTagPool).join(", "));
            return [];
        } else {
            console.log("✅ 成功抓取！第一題的標籤是:", candidates[0].debugTags);
        }

        // 5. 取出題目
        const total = config.total || 10;
        return candidates.slice(0, total).map(c => c.func());
    }

    window.generatePaper = generatePaper;
    console.log("✅ Paper Generator V10.0 (Smart Adapter) 已載入 - 支援年級同義詞互通");

})(window);
