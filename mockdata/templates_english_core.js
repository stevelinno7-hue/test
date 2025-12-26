(function (global) {
    'use strict';

    function init() {
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);
        if (!G || !G.registerTemplate) {
            setTimeout(init, 100);
            return;
        }

        const { pick, shuffle } = G.utils;

        // =====================================================
        // English Grammar Database (STRICT STANDARD)
        // q : question
        // a : answer
        // o : options
        // t : [grade, concept]
        // =====================================================
        const grammarDB = [
            // ===== 國七 =====
            { q: "Listen! The baby _____ in the bedroom.", a: "is crying", o: ["cries","cried","cry"], t: ["國七","時態"] },
            { q: "My father _____ newspapers every morning.", a: "reads", o: ["read","reading","is reading"], t: ["國七","時態"] },
            { q: "We _____ a movie last night.", a: "watched", o: ["watch","watching","have watched"], t: ["國七","時態"] },
            { q: "Where _____ you born?", a: "were", o: ["was","are","did"], t: ["國七","時態"] },
            { q: "The meeting will start _____ 9:00 AM.", a: "at", o: ["in","on","for"], t: ["國七","介系詞"] },

            // ===== 國八 =====
            { q: "They _____ to Japan three times.", a: "have been", o: ["have gone","went","go"], t: ["國八","現在完成式"] },
            { q: "The window _____ by the boy.", a: "was broken", o: ["broke","broken","is broken"], t: ["國八","被動"] },
            { q: "My mom made me _____ the floor.", a: "mop", o: ["to mop","mopping","mopped"], t: ["國八","使役"] },
            { q: "You are a student, _____?", a: "aren't you", o: ["are you","do you","don't you"], t: ["國八","附加問句"] },

            // ===== 國九 =====
            { q: "The work must _____ by Friday.", a: "be done", o: ["do","done","doing"], t: ["國九","被動"] },
            { q: "The girl _____ is crying is my sister.", a: "who", o: ["which","whose","whom"], t: ["國九","關係代名詞"] },
            { q: "I will call you _____ I arrive.", a: "as soon as", o: ["although","unless","so that"], t: ["國九","連接詞"] },

            // ===== 高一 =====
            { q: "By the time you come back, I _____ the work.", a: "will have finished", o: ["finish","finished","have finished"], t: ["高一","完成式"] },
            { q: "The girl _____ in red is my cousin.", a: "dressed", o: ["dressing","dress","dresses"], t: ["高一","分詞"] },

            // ===== 高二 =====
            { q: "If I _____ you, I would accept the offer.", a: "were", o: ["am","was","be"], t: ["高二","假設語氣"] },
            { q: "Here _____ the bus!", a: "comes", o: ["come","is coming","coming"], t: ["高二","倒裝"] },

            // ===== 高三 =====
            { q: "Never _____ such a beautiful sight.", a: "have I seen", o: ["I have seen","I saw","did I saw"], t: ["高三","倒裝"] },
            { q: "If I _____ known the truth, I would have told you.", a: "had", o: ["have","has","having"], t: ["高三","假設語氣"] }
        ];

        // =====================================================
        // 🔍 Self-Diagnostic Scanner (Never Crash)
        // =====================================================
        grammarDB.forEach((q, i) => {
            if (!q || !q.t || !Array.isArray(q.t) || typeof q.t[0] !== "string") {
                console.warn(`⚠️ [EnglishDB] Bad question at index ${i}`, q);
            }
        });

        // =====================================================
        // Grade-Isolated Template Registration
        // =====================================================
        const grades = ["國七", "國八", "國九", "高一", "高二", "高三"];

        grades.forEach(grade => {
            const pool = grammarDB.filter(q =>
                q &&
                q.t &&
                Array.isArray(q.t) &&
                q.t[0] === grade
            );

            if (!pool.length) return;

            G.registerTemplate(
                `eng_grammar_${grade}`,
                () => {
                    const item = pick(pool);
                    const options = shuffle([item.a, ...item.o]);

                    return {
                        question: `【English】${item.q}`,
                        options,
                        answer: options.indexOf(item.a),
                        concept: item.t[1],
                        explanation: [
                            `Answer: ${item.a}`,
                            `Concept: ${item.t[1]}`
                        ]
                    };
                },
                ["english", "英文", "英語", "文法", grade]
            );
        });

        // =====================================================
        // Dialogue (Safe & Simple)
        // =====================================================
        const dialogues = [
            { a: "How are you today?", b: "I'm fine, thank you.", o: ["Yes, I am.", "Goodbye."], t: "問候" },
            { a: "May I take your order?", b: "I'd like a hamburger.", o: ["No, I won't.", "See you."], t: "餐廳" }
        ];

        G.registerTemplate(
            "eng_dialogue_basic",
            () => {
                const item = pick(dialogues);
                const options = shuffle([item.b, ...item.o]);

                return {
                    question: `A: ${item.a}\nB: __________`,
                    options,
                    answer: options.indexOf(item.b),
                    concept: `會話 (${item.t})`,
                    explanation: [`A: ${item.a}`, `B: ${item.b}`]
                };
            },
            ["english", "英文", "英語", "會話", "國七", "國八"]
        );

        console.log("🏆 English Core V4.0 Ultimate 已載入（零爆炸保證）");
    }

    init();
})(window);
