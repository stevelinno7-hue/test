(function(global){
    'use strict';

    if (!Array.prototype.shuffle) {
        Array.prototype.shuffle = function() {
            let arr = this.slice();
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        };
    }

    function normalizeTags(raw) {
        if (!raw) return [];
        let tags = Array.isArray(raw) ? raw : String(raw).split(/[,，\s]+/).filter(Boolean);
        return tags.map(t => String(t).trim().toLowerCase());
    }

    function generatePaper(config) {
        const subject = (config.subject || 'math').toLowerCase();
        const requestTags = normalizeTags(config.tags || []);
        
        const repos = [
            window.__MATH_REPO__, window.__PHYSICS_REPO__, window.__CHEMISTRY_REPO__,
            window.__BIOLOGY_REPO__, window.__EARTH_SCI_REPO__, window.__CHINESE_REPO__,
            window.__ENGLISH_REPO__, window.__HISTORY_REPO__, window.__CIVICS_REPO__, window.__GEOGRAPHY_REPO__
        ].filter(Boolean);

        let candidates = [];

        repos.forEach(repo => {
            Object.keys(repo).forEach(tid => {
                const t = repo[tid];
                if (!t) return;

                const tSubject = String(t.subject || "").toLowerCase();
                let isMatch = (tSubject.includes(subject) || subject.includes(tSubject));
                if (!isMatch) return;

                const itemTags = normalizeTags(t.tags || t.meta || []);
                let score = requestTags.length === 0 ? 1 : 0;
                if (requestTags.length > 0) {
                    const hitCount = requestTags.filter(rt => itemTags.includes(rt)).length;
                    if (hitCount > 0) score = 10 + hitCount;
                }

                if (score > 0) {
                    candidates.push({
                        tid: tid,
                        score: score + Math.random(),
                        isGroup: t.type === "group",
                        rawData: t
                    });
                }
            });
        });

        candidates.sort((a, b) => b.score - a.score);
        const selected = candidates.slice(0, config.total || 10);

        return selected.map(c => {
            const t = c.rawData;

            if (t.type === 'group' || c.isGroup) {
                return {
                    type: 'group',
                    context: t.context,
                    concept: t.concept || (t.questions[0].t ? t.questions[0].t[0] : "地科題組"),
                    questions: t.questions.map(subQ => {
                        const shuffledOptions = [subQ.a, ...(subQ.o || [])].sort(() => Math.random() - 0.5);
                        return {
                            question: subQ.q,
                            options: shuffledOptions,
                            answer: shuffledOptions.indexOf(subQ.a),
                            concept: subQ.t ? subQ.t[subQ.t.length - 1] : "子題目"
                        };
                    })
                };
            } else {
                if (typeof t.func === 'function') {
                    const data = t.func();
                    return {
                        type: 'normal',
                        question: data.question,
                        options: data.options,
                        answer: data.answer,
                        concept: (t.tags && t.tags[t.tags.length - 1]) || "一般題型"
                    };
                } else {
                    const shuffledOptions = [t.a, ...(t.o || [])].sort(() => Math.random() - 0.5);
                    return {
                        type: 'normal',
                        question: t.q,
                        options: shuffledOptions,
                        answer: shuffledOptions.indexOf(t.a),
                        concept: (t.tags && t.tags[t.tags.length - 1]) || "一般題型"
                    };
                }
            }
        });
    }

    global.generatePaper = generatePaper;
    console.log("✅ Paper Generator V11.5 已針對自定義格式優化完成");

})(window);
