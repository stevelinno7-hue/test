(function(global){
    'use strict';
    function init() {
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);
        if (!G || !G.registerTemplate) { setTimeout(init, 100); return; }
        const { pick, shuffle } = G.utils;

        const bioDB = [
            { t:["國七","細胞"], q: "細胞的發電廠是？", a: "粒線體", o: ["葉綠體", "細胞核"] },
            { t:["國七","細胞"], q: "控制物質進出細胞的構造？", a: "細胞膜", o: ["細胞壁", "液泡"] },
            { t:["國七","遺傳"], q: "人類體細胞染色體數目？", a: "46條", o: ["23條", "44條"] },
            { t:["國七","循環"], q: "攜帶氧氣的血球是？", a: "紅血球", o: ["白血球", "血小板"] }
        ];

        G.registerTemplate('bio_concept', (ctx, rnd) => {
            const item = pick(bioDB);
            const opts = shuffle([item.a, ...item.o]);
            return {
                question: `【生物】${item.q}`,
                options: opts, answer: opts.indexOf(item.a), concept: item.t[1],
                explanation: [`答案：${item.a}`]
            };
        }, ["biology", "生物", "自然", "國七", "國八"]);

        console.log("✅ 生物題庫已載入完成。");
    }
    init();
})(window);
