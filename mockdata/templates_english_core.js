(function(global){
    'use strict';

    function init() {
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);
        if (!G || !G.registerTemplate) { setTimeout(init, 80); return; }

        const { pick, shuffle } = G.utils;

        // ==========================================
        // ⭐ 生活感更強的英文文法題庫 ⭐
        // ==========================================
        const grammarDB = [
            // —— Tenses 時態 ——
            { q: "Listen! The baby _____ in the bedroom again. I think he's hungry.", a: "is crying", o: ["cries","cried","cry"], tag: ["國七","時態"] },
            { q: "Every morning, my father sits in the kitchen and _____ newspapers with a cup of coffee.", a: "reads", o: ["read","reading","is reading"], tag: ["國七","時態"] },
            { q: "We _____ a movie last night at the theater. It was really good!", a: "watched", o: ["watch","watching","have watched"], tag: ["國七","時態"] },
            { q: "They _____ to Japan three times. They really love traveling.", a: "have been", o: ["have gone","went","go"], tag: ["國八","時態"] },
            { q: "I _____ my homework yet. Can you wait a minute?", a: "haven't finished", o: ["didn't finish","don't finish","won't finish"], tag: ["國八","時態"] },
            { q: "When I arrived at his place, he _____ dinner in the kitchen.", a: "was having", o: ["has","is having","had"], tag: ["國八","時態"] },
            { q: "By the time you come back from the store, I _____ the work.", a: "will have finished", o: ["finish","finished","have finished"], tag: ["高一","時態"] },

            // —— Passive 被動語態 ——
            { q: "The window _____ by the boy yesterday while they were playing baseball.", a: "was broken", o: ["broke","broken","is broken"], tag: ["國八","被動"] },
            { q: "English _____ in many countries, so it's useful to learn it well.", a: "is spoken", o: ["speaks","spoke","is speaking"], tag: ["國八","被動"] },
            { q: "The work must _____ by Friday or the project will be delayed.", a: "be done", o: ["do","done","doing"], tag: ["國九","被動"] },
            { q: "The cake _____ right now. The kitchen smells amazing!", a: "is being made", o: ["is making","makes","made"], tag: ["國九","被動"] },

            // —— 使役 / 感官 / 授與 ——
            { q: "My mom made me _____ the floor before I could go out and play.", a: "mop", o: ["to mop","mopping","mopped"], tag: ["國八","使役"] },
            { q: "I saw him _____ the street just now. He was in a hurry.", a: "cross", o: ["to cross","crossed","to crossing"], tag: ["國八","感官"] },
            { q: "He gave me _____ as a birthday present yesterday!", a: "a book", o: ["to a book","for a book","at a book"], tag: ["國八","授與"] },

            // —— Gerund / Infinitive ——
            { q: "I enjoy _____ music when I'm studying. It helps me relax.", a: "listening to", o: ["to listen to","listen to","listened to"], tag: ["國九","動名詞"] },
            { q: "She wants _____ a doctor when she grows up.", a: "to be", o: ["being","be","is"], tag: ["國九","不定詞"] },
            { q: "He quit _____ last year because it was bad for his health.", a: "smoking", o: ["to smoke","smoke","smoked"], tag: ["國九","動名詞"] },
            { q: "Remember _____ the door when you leave. It's getting cold outside.", a: "to lock", o: ["locking","lock","locked"], tag: ["國九","不定詞"] },

            // —— Relative Clauses 關代 ——
            { q: "The girl _____ is crying is my little sister. She lost her toy.", a: "who", o: ["which","whose","whom"], tag: ["國九","關代"] },
            { q: "This is the book _____ I bought yesterday at the bookstore.", a: "which", o: ["who","whose","where"], tag: ["國九","關代"] },
            { q: "The man _____ car was stolen reported it to the police immediately.", a: "whose", o: ["who","which","that"], tag: ["國九","關代"] },
            { q: "He is the only person _____ knows the secret code.", a: "that", o: ["who","which","whose"], tag: ["高一","關代"] },

            // —— Conjunction / Hypothetical ——
            { q: "_____ it rained heavily, we still went hiking. We didn't want to miss the fun.", a: "Although", o: ["Because","If","But"], tag: ["國八","連接詞"] },
            { q: "If I _____ you, I would accept the offer. It's a great opportunity.", a: "were", o: ["am","was","be"], tag: ["高二","假設"] },
            { q: "If it _____ tomorrow, we will cancel the picnic and stay home instead.", a: "rains", o: ["rained","will rain","rain"], tag: ["高一","假設"] },

            // —— Inversion / Comparatives ——
            { q: "Never _____ such a beautiful sight. The sunset was breathtaking.", a: "have I seen", o: ["I have seen","I saw","did I saw"], tag: ["高三","倒裝"] },
            { q: "He is _____ than his brother. He can reach the top shelf easily.", a: "taller", o: ["tall","tallest","the tallest"], tag: ["國八","比較"] },
            { q: "The more you learn, the _____ you become. Knowledge is power!", a: "wiser", o: ["wise","wisest","more wise"], tag: ["高一","比較"] }
        ];

        // =============================
        // 題型：文法選擇題（安全強化版）
        // =============================
        G.registerTemplate('eng_grammar_choice', (ctx, rnd) => {
            const item = pick(grammarDB);
            
            // 1. 處理正確答案 (Trim 去空白)
            const correctAns = item.a.trim();

            // 2. 處理錯誤選項 (Trim + 過濾掉不小心寫進去的正確答案)
            const validDistractors = item.o
                .map(opt => opt.trim())
                .filter(opt => opt !== correctAns); // 雙重保險

            // 3. 組合選項
            const opts = shuffle([correctAns, ...validDistractors]);

            return {
                question: item.q,
                options: opts,
                answer: opts.indexOf(correctAns), // 確保 index 抓對
                concept: item.tag[1],
                explanation: [`Correct answer: ${item.a}`]
            };
        }, ["english","英文","文法","國七","國八","國九","高一","高二","高三"]);

        // ==========================================
        // ⭐ 對話填空（安全強化版）
        // ==========================================
        const dialogues = [
            { a: "How have you been recently?", b: "I've been doing great, thanks!", o: ["I am doing homework.","Yes, I am.","See you later."], t: "問候" },
            { a: "May I take your order?", b: "Yes, I'd like a steak, please.", o: ["No, I don't like it.","Here is the menu.","Check, please."], t: "餐廳" },
            { a: "Excuse me, how do I get to the station?", b: "Go straight and turn left at the second light.", o: ["It is 5 o'clock.","I am taking a bus.","Yes, it is."], t: "問路" }
        ];

        G.registerTemplate('eng_dialogue', (ctx, rnd) => {
            const item = pick(dialogues);
            
            // 同樣進行字串修整與防呆
            const correctAns = item.b.trim();
            const validDistractors = item.o
                .map(opt => opt.trim())
                .filter(opt => opt !== correctAns);

            const opts = shuffle([correctAns, ...validDistractors]);

            return {
                question: `A: ${item.a}\nB: __________`,
                options: opts,
                answer: opts.indexOf(correctAns),
                concept: `會話 (${item.t})`,
                explanation: [`A: ${item.a}`, `B: ${item.b}`]
            };
        }, ["english","英文","會話"]);

        console.log("✨ 英文文法題庫 (安全版) 載入完畢！");
    }

    init();

})(window);
