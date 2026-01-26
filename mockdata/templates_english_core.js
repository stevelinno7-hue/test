(function(global){
    'use strict';

    // 1. 初始化英文避難所
    if (!window.__ENGLISH_REPO__) window.__ENGLISH_REPO__ = {};
    console.log("🚀 [English V9.5] 英文題庫 (課綱標籤精準對齊版) 啟動...");

    const Utils = {
        shuffle: (arr) => arr.sort(() => Math.random() - 0.5)
    };

    // ==========================================
    // 📚 英文文法資料庫 (完全對應 curriculum_integrated.js)
    // ==========================================
    const grammarDB = [
        // ----------------------------------------------------
        // [國七上] Unit 1: Be Verbs (be動詞)
        // ----------------------------------------------------
        { q: "I _____ a student.", a: "am", o: ["is", "are", "be"], tag: ["國七", "be動詞"] },
        { q: "They _____ my friends.", a: "are", o: ["is", "am", "be"], tag: ["國七", "be動詞"] },
        { q: "She _____ happy today.", a: "is", o: ["are", "am", "be"], tag: ["國七", "be動詞"] },
        
        // ----------------------------------------------------
        // [國七上] Unit 2: Nouns (名詞/單複數)
        // ----------------------------------------------------
        { q: "I have two _____.", a: "watches", o: ["watch", "watchs", "watching"], tag: ["國七", "名詞", "單複數"] },
        { q: "These are my _____.", a: "books", o: ["book", "book's", "a book"], tag: ["國七", "名詞", "單複數"] },
        { q: "That _____ a cat.", a: "is", o: ["are", "am", "be"], tag: ["國七", "名詞"] }, // This/That 搭配 be動詞

        // ----------------------------------------------------
        // [國七上] Unit 3: Imperatives (祈使句)
        // ----------------------------------------------------
        { q: "_____ quiet, please.", a: "Be", o: ["Don't", "Do", "Are"], tag: ["國七", "祈使句"] },
        { q: "_____ run in the classroom.", a: "Don't", o: ["Not", "No", "Be"], tag: ["國七", "祈使句"] },
        { q: "Let's _____ to the park.", a: "go", o: ["going", "to go", "goes"], tag: ["國七", "祈使句"] },

        // ----------------------------------------------------
        // [國七下] Unit 1: Present Progressive (現在進行式)
        // ----------------------------------------------------
        { q: "Look! He _____ basketball.", a: "is playing", o: ["plays", "play", "played"], tag: ["國七", "現在進行式"] },
        { q: "What _____ you doing?", a: "are", o: ["do", "can", "will"], tag: ["國七", "現在進行式"] },
        { q: "The birds _____ singing.", a: "are", o: ["is", "do", "can"], tag: ["國七", "現在進行式"] },

        // ----------------------------------------------------
        // [國七下] Unit 2: Quantifiers (數量詞)
        // ----------------------------------------------------
        { q: "How _____ water do you need?", a: "much", o: ["many", "long", "often"], tag: ["國七", "數量詞"] },
        { q: "There are _____ students in the classroom.", a: "many", o: ["much", "little", "any"], tag: ["國七", "數量詞"] },
        { q: "Do you have _____ money?", a: "any", o: ["many", "few", "a few"], tag: ["國七", "數量詞"] },

        // ----------------------------------------------------
        // [國七下] Unit 3: Past Tense (過去式)
        // ----------------------------------------------------
        { q: "I _____ at home yesterday.", a: "was", o: ["am", "were", "is"], tag: ["國七", "過去式"] },
        { q: "They _____ busy last night.", a: "were", o: ["are", "was", "is"], tag: ["國七", "過去式"] },
        { q: "Where _____ you born?", a: "were", o: ["was", "are", "did"], tag: ["國七", "過去式"] },

        // ----------------------------------------------------
        // [國八上] Unit 1: Past Simple (過去式/動詞)
        // ----------------------------------------------------
        { q: "He _____ to the park yesterday.", a: "went", o: ["go", "goes", "gone"], tag: ["國八", "過去式", "動詞"] },
        { q: "_____ you watch TV last night?", a: "Did", o: ["Do", "Are", "Were"], tag: ["國八", "過去式", "動詞"] },
        { q: "She _____ buy the bag.", a: "didn't", o: ["don't", "wasn't", "not"], tag: ["國八", "過去式", "動詞"] },

        // ----------------------------------------------------
        // [國八上] Unit 2: Future Tense (未來式)
        // ----------------------------------------------------
        { q: "I _____ visit my grandma tomorrow.", a: "will", o: ["am", "did", "do"], tag: ["國八", "未來式"] },
        { q: "She is _____ to study hard.", a: "going", o: ["go", "goes", "will"], tag: ["國八", "未來式"] },
        { q: "We _____ be late.", a: "won't", o: ["don't", "aren't", "didn't"], tag: ["國八", "未來式"] },

        // ----------------------------------------------------
        // [國八上] Unit 3: Patterns (句型/授與動詞)
        // ----------------------------------------------------
        { q: "My dad bought a bike _____ me.", a: "for", o: ["to", "of", "with"], tag: ["國八", "句型", "授與動詞"] },
        { q: "He gave the book _____ Mary.", a: "to", o: ["for", "of", "with"], tag: ["國八", "句型", "授與動詞"] },
        { q: "She sent me _____.", a: "a letter", o: ["to a letter", "for a letter", "at a letter"], tag: ["國八", "句型", "授與動詞"] },

        // ----------------------------------------------------
        // [國八下] Unit 1: Comparison (比較級)
        // ----------------------------------------------------
        { q: "He is _____ than me.", a: "taller", o: ["tall", "tallest", "more tall"], tag: ["國八", "比較級"] },
        { q: "This flower is _____ beautiful than that one.", a: "more", o: ["much", "very", "most"], tag: ["國八", "比較級"] },
        { q: "Who is the _____ student in class?", a: "smartest", o: ["smarter", "smart", "most smart"], tag: ["國八", "比較級"] }, // 最高級通常在比較級單元教

        // ----------------------------------------------------
        // [國八下] Unit 2: Verbs Pattern (動詞句型/不定詞)
        // ----------------------------------------------------
        { q: "It took me two hours _____ the work.", a: "to finish", o: ["finishing", "finish", "finished"], tag: ["國八", "動詞句型"] },
        { q: "I spent 100 dollars _____ the book.", a: "buying", o: ["to buy", "buy", "bought"], tag: ["國八", "動詞句型"] },
        { q: "He enjoys _____ music.", a: "listening to", o: ["to listen to", "listen to", "listened to"], tag: ["國八", "動詞句型"] },

        // ----------------------------------------------------
        // [國八下] Unit 3: Conjunctions (連接詞)
        // ----------------------------------------------------
        { q: "_____ he was sick, he went to school.", a: "Although", o: ["Because", "So", "If"], tag: ["國八", "連接詞"] },
        { q: "Wash your hands _____ you eat.", a: "before", o: ["so", "because", "but"], tag: ["國八", "連接詞"] },
        { q: "I was sleeping _____ the phone rang.", a: "when", o: ["because", "if", "so"], tag: ["國八", "連接詞"] },

        // ----------------------------------------------------
        // [國九上] Unit 1: Present Perfect (現在完成式)
        // ----------------------------------------------------
        { q: "I _____ been to Japan twice.", a: "have", o: ["has", "am", "did"], tag: ["國九", "現在完成式"] },
        { q: "She _____ lived here since 2010.", a: "has", o: ["have", "is", "was"], tag: ["國九", "現在完成式"] },
        { q: "Have you _____ finished your homework?", a: "already", o: ["yet", "ever", "never"], tag: ["國九", "現在完成式"] },

        // ----------------------------------------------------
        // [國九上] Unit 2: Passive Voice (被動語態)
        // ----------------------------------------------------
        { q: "The apple _____ by him.", a: "was eaten", o: ["ate", "eaten", "was eating"], tag: ["國九", "被動語態"] },
        { q: "English _____ in the USA.", a: "is spoken", o: ["speaks", "spoke", "speaking"], tag: ["國九", "被動語態"] },
        { q: "The work must _____ be done.", a: "be", o: ["is", "was", "been"], tag: ["國九", "被動語態"] },

        // ----------------------------------------------------
        // [國九上/下] Unit 3/1: Relative Clause (關係子句)
        // ----------------------------------------------------
        { q: "The boy _____ is running is Tom.", a: "who", o: ["which", "whose", "whom"], tag: ["國九", "關係子句"] },
        { q: "This is the car _____ I bought.", a: "which", o: ["who", "whose", "where"], tag: ["國九", "關係子句"] },
        { q: "The man _____ hair is red is my teacher.", a: "whose", o: ["who", "which", "that"], tag: ["國九", "關係子句"] },

        // ----------------------------------------------------
        // [國九下] Unit 2: Noun Clauses (名詞子句)
        // ----------------------------------------------------
        { q: "I don't know _____ he is.", a: "who", o: ["that", "which", "weather"], tag: ["國九", "名詞子句"] },
        { q: "Tell me _____ you live.", a: "where", o: ["what", "which", "that"], tag: ["國九", "名詞子句"] },
        { q: "He said _____ he was hungry.", a: "that", o: ["what", "which", "where"], tag: ["國九", "名詞子句"] },

        // ----------------------------------------------------
        // [高一上] Unit 1: Sentence Structure (句型)
        // ----------------------------------------------------
        { q: "The news made him _____.", a: "happy", o: ["happily", "happiness", "to happy"], tag: ["高一", "句型"] }, // S+V+O+OC
        { q: "I found the book _____.", a: "interesting", o: ["interest", "interested", "interestingly"], tag: ["高一", "句型"] },
        
        // ----------------------------------------------------
        // [高一上] Unit 2: Perfect Tenses (完成式 - 進階)
        // ----------------------------------------------------
        { q: "By next year, I _____ here for ten years.", a: "will have lived", o: ["live", "lived", "have lived"], tag: ["高一", "完成式"] },
        { q: "The movie _____ when we arrived.", a: "had started", o: ["starts", "started", "has started"], tag: ["高一", "完成式"] },

        // ----------------------------------------------------
        // [高一下] Unit 1: Participles (分詞)
        // ----------------------------------------------------
        { q: "The girl _____ in the corner is shy.", a: "standing", o: ["stood", "stands", "stand"], tag: ["高一", "分詞"] },
        { q: "_____ by the dog, he went to the hospital.", a: "Bitten", o: ["Biting", "Bit", "To bite"], tag: ["高一", "分詞"] },

        // ----------------------------------------------------
        // [高一下] Unit 2: Infinitives (不定詞)
        // ----------------------------------------------------
        { q: "It is dangerous _____ swim here.", a: "to", o: ["for", "of", "with"], tag: ["高一", "不定詞"] },
        { q: "She is too tired _____ walk.", a: "to", o: ["for", "that", "so"], tag: ["高一", "不定詞"] },

        // ----------------------------------------------------
        // [高二上] Unit 1: Subjunctive Mood (假設語氣)
        // ----------------------------------------------------
        { q: "If I _____ a bird, I would fly to you.", a: "were", o: ["am", "was", "be"], tag: ["高二", "假設語氣"] },
        { q: "I wish I _____ richer.", a: "were", o: ["am", "will be", "can be"], tag: ["高二", "假設語氣"] },

        // ----------------------------------------------------
        // [高二上] Unit 2: Inversion (倒裝句)
        // ----------------------------------------------------
        { q: "Never _____ I seen such a big apple.", a: "have", o: ["had", "did", "do"], tag: ["高二", "倒裝句"] },
        { q: "Only then _____ I realize my mistake.", a: "did", o: ["do", "have", "had"], tag: ["高二", "倒裝句"] },

        // ----------------------------------------------------
        // [高二下] Unit 2: Compound Adj (複合形容詞)
        // ----------------------------------------------------
        { q: "He is a _____ boy.", a: "ten-year-old", o: ["ten-years-old", "ten years old", "ten-year old"], tag: ["高二", "複合形容詞"] },
        { q: "This is a _____ map.", a: "hand-made", o: ["hand-make", "hand-making", "making-hand"], tag: ["高二", "複合形容詞"] }
    ];

    // 4. 自動註冊工廠
    grammarDB.forEach((item, idx) => {
        const id = `eng_aligned_${idx}`;
        
        // ★ 這裡很重要：我們要把 curriculum_integrated.js 裡用到的標籤全部塞進去
        // 這樣不管系統用哪個標籤來撈，都撈得到。
        const tags = ["english", "eng", "英文", "文法", ...item.tag];

        const generatorFunc = () => {
            const allOpts = [item.a, ...item.o];
            const shuffledOpts = Utils.shuffle(allOpts);

            return {
                question: `Complete the sentence: "${item.q}"`,
                options: shuffledOpts,
                answer: shuffledOpts.indexOf(item.a),
                concept: item.tag[1] || "Grammar", 
                explanation: [`Correct answer: **${item.a}**`, `} example]`],
                subject: "english",
                tags: tags
            };
        };

        generatorFunc.subject = "english";
        generatorFunc.tags = tags;
        
        window.__ENGLISH_REPO__[id] = {
            func: generatorFunc,
            tags: tags,
            subject: "english"
        };
    });

    console.log(`✅ [English] 已成功載入 ${grammarDB.length} 題精準對齊標籤的題目。`);

})(window);
