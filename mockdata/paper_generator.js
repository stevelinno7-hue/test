(function(global){
    'use strict';

    // ==============================
    // Paper Generator V11.0
    // 完全支援單題 + 題組 + 年級智慧匹配
    // ==============================

    if (!Array.prototype.shuffle) {
        Array.prototype.shuffle = function() {
            for (let i = this.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this[i], this[j]] = [this[j], this[i]];
            }
            return this;
        };
    }

    if (!window.RigorousGenerator) {
        window.RigorousGenerator = {
            _templates: {},
            registerTemplate: function(id, f, t){
                this._templates[id] = {func:f, tags:t, subject: f.subject || 'misc'};
            }
        };
    }

    // ===== 標籤清洗與同義詞擴充 =====
    function normalizeTags(raw) {
        if (!raw) return [];
        let tags = [];
        if (typeof raw === 'string') {
            tags = raw.split(/[,，\s]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
        } else if (Array.isArray(raw)) {
            tags = raw.map(t => String(t).trim().toLowerCase()).filter(Boolean);
        }

        const expandedTags = [];
        tags.forEach(t => {
            expandedTags.push(t);

            if (['國七','七年級','grade7'].includes(t)) expandedTags.push('國七','七年級','grade7');
            if (['國八','八年級','grade8'].includes(t)) expandedTags.push('國八','八年級','grade8');
            if (['國九','九年級','grade9'].includes(t)) expandedTags.push('國九','九年級','grade9');
            if (['高一','十年級','grade10'].includes(t)) expandedTags.push('高一','十年級','grade10');
            if (['高二','十一年級','grade11'].includes(t)) expandedTags.push('高二','十一年級','grade11');
            if (['高三','十二年級','grade12'].includes(t)) expandedTags.push('高三','十二年級','grade12');

            if (['junior_high','國中','junior','国中'].includes(t)) {
                expandedTags.push('國七','國八','國九','七年級','八年級','九年級');
            }
            if (['high_school','senior_high','高中','senior'].includes(t)) {
                expandedTags.push('高一','高二','高三','十年級','十一年級','十二年級');
            }
        });

        return [...new Set(expandedTags)];
    }

    // ===== 出題核心 =====
    function generatePaper(config) {
        let G = window.RigorousGenerator;
        if (!G) G = window.RigorousGenerator = { _templates: {} };
        if (!G.getTemplateIds) G.getTemplateIds = () => Object.keys(G._templates || {});

        const subject = (config.subject || 'math').toLowerCase();
        const requestTags = normalizeTags(config.tags || []);

        console.log(`🔒 [Gen V11.0] 科目: ${subject}`);
        console.log(`🎯 請求標籤 (含同義詞):`, requestTags);

        const repos = [
            window.__MATH_REPO__, window.__PHYSICS_REPO__, window.__CHEMISTRY_REPO__,
            window.__BIOLOGY_REPO__, window.__EARTH_SCI_REPO__, window.__CHINESE_REPO__,
            window.__ENGLISH_REPO__, window.__HISTORY_REPO__, window.__CIVICS_REPO__, window.__GEOGRAPHY_REPO__
        ];

        let candidates = [];
        let debugTagPool = new Set();

        repos.forEach(repo => {
            if (!repo) return;
            Object.keys(repo).forEach(tid => {
                const t = repo[tid];
                if (!t) return;

                const tSubject = String(t.subject || "").toLowerCase().trim();

                let isSubjectMatch = false;

                const sciencePool = ['physics', 'chemistry', 'science', '理化', '物理', '化學', '自然'];
                if (subject === 'science') {
                    if (sciencePool.some(s => tSubject.includes(s))) isSubjectMatch = true;
                    else {
                        const rawTagsForSub = normalizeTags(t.tags || t.meta || []);
                        if (rawTagsForSub.some(tag => ['理化','物理','化學'].includes(tag))) isSubjectMatch = true;
                    }
                } else if (tSubject.includes(subject) || subject.includes(tSubject)) {
                    isSubjectMatch = true;
                }

                if (!isSubjectMatch) return;

                // ===== 支援題組 =====
                if (t.type === "group" && Array.isArray(t.questions)) {
                    t.questions.forEach((qItem, qIdx) => {
                        const qTags = normalizeTags(qItem.t || []);
                        const metaTags = qTags.concat([tSubject]);
                        debugTagPool = new Set([...debugTagPool, ...metaTags]);

                        let hitCount = 0;
                        requestTags.forEach(rt => { if (metaTags.includes(rt)) hitCount++; });
                        if (hitCount > 0 || requestTags.length === 0) {
                            candidates.push({
                                tid: tid + "_" + qIdx,
                                score: 10 + hitCount + Math.random(),
                                func: () => {
                                    const opts = [qItem.a, ...qItem.o].shuffle();
                                    return {
                                        question: t.context + "<br><br>" + qItem.q,
                                        options: opts,
                                        answer: opts.indexOf(qItem.a),
                                        explanation: [`✅ 正確答案：${qItem.a}`],
                                        subject: subject,
                                        tags: qTags
                                    };
                                }
                            });
                        }
                    });
                    return;
                }

                // ===== 單題 =====
                const rawTags = t.tags || t.meta || (t.func && t.func.tags) || [];
                const metaTags = normalizeTags(rawTags).concat([tSubject]);
                metaTags.forEach(mt => debugTagPool.add(mt));

                let score = 0;
                if (requestTags.length === 0) score = 1;
                else {
                    let hitCount = 0;
                    requestTags.forEach(rt => { if (metaTags.includes(rt)) hitCount++; });
                    if (hitCount > 0) score = 10 + hitCount;
                }

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

        candidates.sort((a,b) => b.score - a.score);

        console.log(`📊 篩選結果: 找到 ${candidates.length} 題符合條件`);
        if (candidates.length === 0) {
            console.error("❌ 找不到題目！");
            console.warn("🧐 題庫中現有的標籤:", Array.from(debugTagPool).join(", "));
            return [];
        } else {
            console.log("✅ 第一題標籤:", candidates[0].debugTags);
        }

        const total = config.total || 10;
        return candidates.slice(0,total).map(c => c.func());
    }

    window.generatePaper = generatePaper;
    console.log("✅ Paper Generator V11.0 已載入 - 支援題組 + 年級同義詞互通");

})(window);
