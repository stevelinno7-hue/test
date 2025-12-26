(function(global){
    'use strict';

    function init() {
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);
        if (!G || !G.registerTemplate) { setTimeout(init, 100); return; }
        const { pick, shuffle } = G.utils;

        // ==========================================
        // 英文文法資料庫 (屬性統一為 t, 避免 undefined 錯誤)
        // ==========================================
        const grammarDB = [
            // [國七] Tenses
            { q: "Listen! The baby _____ in the bedroom.", a: "is crying", o: ["cries","cried","cry"], t: ["國七","時態"] },
            { q: "My father _____ newspapers every morning.", a: "reads", o: ["read","reading","is reading"], t: ["國七","時態"] },
            { q: "We _____ a movie last night.", a: "watched", o: ["watch","watching","have watched"], t: ["國七","時態"] },
            { q: "_____ you going to the party?", a: "Are", o: ["Do","Will","Have"], t: ["國七","時態"] },
            { q: "Where _____ you born?", a: "were", o: ["was","are","did"], t: ["國七","時態"] },

            // [國八] Perfect / Passive
            { q: "They _____ to Japan three times.", a: "have been", o: ["have gone","went","go"], t: ["國八","時態"] },
            { q: "The window _____ by the boy.", a: "was broken", o: ["broke","broken","is broken"], t: ["國八","被動"] },
            { q: "He gave me _____.", a: "a book", o: ["to a book","for a book","at a book"], t: ["國八","授與"] },
            { q: "It is important _____ English.", a: "to learn", o: ["learning","learn","learned"], t: ["國八","不定詞"] },

            // [國九] Participles / Clauses
            { q: "The work must _____ by Friday.", a: "be done", o: ["do","done","doing"], t: ["國九","被動"] },
            { q: "I enjoy _____ music.", a: "listening to", o: ["to listen to","listen to","listened to"], t: ["國九","動名詞"] },
            { q: "The girl _____ is crying is my sister.", a: "who", o: ["which","whose","whom"], t: ["國九","關代"] },
            { q: "The man _____ car was stolen is my uncle.", a: "whose", o: ["who","that","which"], t: ["國九","關代"] },

            // [高一] Advanced
            { q: "By the time you come back, I _____ the work.", a: "will have finished", o: ["finish","finished","have finished"], t: ["高一","時態"] },
            { q: "If it _____ tomorrow, we will cancel.", a: "rains", o: ["rained","will rain","rain"], t: ["高一","假設"] },
            { q: "The reason _____ he left is unknown.", a: "why", o: ["which","that","what"], t: ["高一","關代"] },

            // [高二/高三] Complex
            { q: "If I _____ you, I would accept the offer.", a: "were", o: ["am","was","be"], t: ["高二","假設"] },
            { q: "Never _____ such a beautiful sight.", a: "have I seen", o: ["I have seen","I saw","did I saw"], t: ["高三","倒裝"] }
        ];

        // ==========================================
        // 分年級註冊 (Grade Locking)
        // ==========================================
        const grades = ["國七", "國八", "國九", "高一", "高二", "高三"];

        grades.forEach(grade => {
            // ★★★ 關鍵修復：這裡加上了 (q.t && q.t[0]) 的雙重檢查 ★★★
            // 這樣就算資料庫裡有一行壞掉的資料，也不會讓整個程式崩潰
            const pool = grammarDB.filter(q => q.t && Array.isArray(q.t) && q.t[0] === grade);
            
            // 為該年級註冊專屬模板
            if (pool.length > 0) {
                G.registerTemplate(`eng_gram_${grade}`, (ctx, rnd) => {
                    const item = pick(pool);
                    const opts = shuffle([item.a, ...item.o]);
                    
                    return {
                        question: `【English】${item.q}`,
                        options: opts,
                        answer: opts.indexOf(item.a),
                        concept: item.t[1], 
                        explanation: [`Correct answer: ${item.a}`]
                    };
                }, ["english", "英文", "文法", grade]); // 關鍵：把年級加進 tags
            }
        });

        console.log("✨ 英文文法題庫 (屬性修復版) 載入完畢！");
    }

    init();

})(window);
