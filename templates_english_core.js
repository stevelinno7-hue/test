(function(global){
    'use strict';

    function init() {
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);
        if (!G || !G.registerTemplate) { setTimeout(init, 100); return; }
        const { pick, shuffle } = G.utils;

        // ==========================================
        // 英文文法資料庫 (Enhanced Grammar DB)
        // ==========================================
        const grammarDB = [
            // [國七] Tenses & Basics
            { q: "Listen! The baby _____ in the bedroom.", a: "is crying", o: ["cries","cried","cry"], t: ["國七","時態"] },
            { q: "My father _____ newspapers every morning.", a: "reads", o: ["read","reading","is reading"], t: ["國七","時態"] },
            { q: "We _____ a movie last night.", a: "watched", o: ["watch","watching","have watched"], t: ["國七","時態"] },
            { q: "_____ you going to the party?", a: "Are", o: ["Do","Will","Have"], t: ["國七","時態"] },
            { q: "The meeting will start _____ 9:00 AM.", a: "at", o: ["in","on","for"], t: ["國七","介系詞"] },
            { q: "He was born _____ 1990.", a: "in", o: ["on","at","of"], t: ["國七","介系詞"] },
            { q: "The book is _____ the table.", a: "on", o: ["in","at","to"], t: ["國七","介系詞"] },

            // [國八] Perfect Tense / Passive / Special Verbs
            { q: "They _____ to Japan three times.", a: "have been", o: ["have gone","went","go"], t: ["國八","時態"] },
            { q: "I _____ my homework yet.", a: "haven't finished", o: ["didn't finish","don't finish","won't finish"], t: ["國八","時態"] },
            { q: "The window _____ by the boy.", a: "was broken", o: ["broke","broken","is broken"], t: ["國八","被動"] },
            { q: "English _____ in many countries.", a: "is spoken", o: ["speaks","spoke","is speaking"], t: ["國八","被動"] },
            { q: "He gave me _____.", a: "a book", o: ["to a book","for a book","at a book"], t: ["國八","授與"] },
            { q: "My mom made me _____ the floor.", a: "mop", o: ["to mop","mopping","mopped"], t: ["國八","使役"] },
            { q: "He is interested _____ music.", a: "in", o: ["on","at","of"], t: ["國八","片語"] },
            { q: "You are a student, _____?", a: "aren't you", o: ["are you","don't you","do you"], t: ["國八","問句"] },

            // [國九] Participles / Clauses / Advanced Grammar
            { q: "The work must _____ by Friday.", a: "be done", o: ["do","done","doing"], t: ["國九","被動"] },
            { q: "I enjoy _____ music.", a: "listening to", o: ["to listen to","listen to","listened to"], t: ["國九","動名詞"] },
            { q: "She wants _____ a doctor.", a: "to be", o: ["being","be","is"], t: ["國九","不定詞"] },
            { q: "The girl _____ is crying is my sister.", a: "who", o: ["which","whose","whom"], t: ["國九","關代"] },
            { q: "This is the book _____ I bought yesterday.", a: "which", o: ["who","whose","where"], t: ["國九","關代"] },
            { q: "I will call you _____ I arrive.", a: "as soon as", o: ["so that","although","unless"], t: ["國九","連接詞"] },

            // [高一] Senior High Basics
            { q: "By the time you come back, I _____ the work.", a: "will have finished", o: ["finish","finished","have finished"], t: ["高一","時態"] },
            { q: "He is the only person _____ knows the secret.", a: "that", o: ["who","which","whose"], t: ["高一","關代"] },
            { q: "If it _____ tomorrow, we will cancel.", a: "rains", o: ["rained","will rain","rain"], t: ["高一","假設"] },
            { q: "The girl _____ in red is my cousin.", a: "dressed", o: ["dressing","dress","dresses"], t: ["高一","分詞"] },

            // [高二] Intermediate
            { q: "If I _____ you, I would accept the offer.", a: "were", o: ["am","was","be"], t: ["高二","假設"] },
            { q: "Here _____ the bus!", a: "comes", o: ["is coming","come","coming"], t: ["高二","倒裝"] },
            { q: "Generally _____, women live longer than men.", a: "speaking", o: ["spoken","speak","to speak"], t: ["高二","分詞"] },

            // [高三] Advanced
            { q: "Never _____ such a beautiful sight.", a: "have I seen", o: ["I have seen","I saw","did I saw"], t: ["高三","倒裝"] },
            { q: "If I _____ known the truth, I would have told you.", a: "had", o: ["have","has","having"], t: ["高三","假設"] }
        ];

        // ==========================================
        // ★★★ 關鍵修正：分年級註冊模板 (Grade Isolation) ★★★
        // ==========================================
        const grades = ["國七", "國八", "國九", "高一", "高二", "高三"];

        grades.forEach(grade => {
            // 1. 物理隔離：只篩選出該年級的題目
            const gradePool = grammarDB.filter(q => q.t && q.t[0] === grade);
            
            if (gradePool.length > 0) {
                // 2. 註冊專屬該年級的模板 (如 eng_gram_國七)
                G.registerTemplate(`eng_gram_${grade}`, (ctx, rnd) => {
                    const item = pick(gradePool); // 只從該年級池抓題
                    const opts = shuffle([item.a, ...item.o]);
                    
                    return {
                        question: `【English】${item.q}`,
                        options: opts,
                        answer: opts.indexOf(item.a),
                        concept: item.t[1],
                        explanation: [`Correct answer: ${item.a}`]
                    };
                }, ["english", "英文", "文法", grade]); // 只給「英文」和「該年級」標籤
            }
        });

        // 3. 對話填空 (通用模板，不分年級，但標記為會話)
        const dialogues = [
            { a: "How have you been?", b: "Great, thanks.", o: ["I am doing homework.", "Yes, I am."], t: "問候" },
            { a: "May I take your order?", b: "I'd like a steak.", o: ["No, I don't like it.", "Check, please."], t: "餐廳" }
        ];
        G.registerTemplate('eng_dialogue', (ctx, rnd) => {
            const item = pick(dialogues);
            const opts = shuffle([item.b, ...item.o]);
            return {
                question: `A: ${item.a}\nB: __________`,
                options: opts,
                answer: opts.indexOf(item.b),
                concept: `會話 (${item.t})`,
                explanation: [`A: ${item.a}`, `B: ${item.b}`]
            };
        }, ["english", "英文", "會話", "國七", "國八"]); // 預設給國七八練習

        console.log("✨ 英文文法題庫 (物理隔離版) 已載入！");
    }

    init();

})(window);
