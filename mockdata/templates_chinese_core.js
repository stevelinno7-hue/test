(function(global){
    'use strict';
    function init() {
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);
        if (!G || !G.registerTemplate) { setTimeout(init, 100); return; }
        const { pick, shuffle } = G.utils;

        const chiData = [
            { q: "白駒過隙", a: "形容時間過得很快", tag: ["國七","成語"] },
            { q: "指鹿為馬", a: "比喻混淆是非", tag: ["國七","成語"] },
            { q: "畫蛇添足", a: "比喻多此一舉", tag: ["國七","成語"] },
            { q: "背影", a: "朱自清", tag: ["國七","現代文"] },
            { q: "師說", a: "韓愈", tag: ["高一","古文"] },
            { q: "舉頭望明月", a: "李白", tag: ["國七","唐詩"] }
        ];

        G.registerTemplate('chi_basic', (ctx, rnd) => {
            const item = pick(chiData);
            const wrong = shuffle(chiData.filter(x => x.a !== item.a)).slice(0, 3).map(x => x.a);
            const opts = shuffle([item.a, ...wrong]);
            return {
                question: `【國文】「${item.q}」的意思或作者是？`,
                options: opts, answer: opts.indexOf(item.a), concept: item.tag[1],
                explanation: [`答案：${item.a}`]
            };
        }, ["chinese", "國文", "國七", "國八", "國九", "高一"]);

        console.log("✅ 國文題庫已載入完成。");
    }
    init();
})(window);
