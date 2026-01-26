(function(global){
    'use strict';

    if (!window.__ENGLISH_REPO__) window.__ENGLISH_REPO__ = {};
    console.log("🚀 [English V8.0] 英文引擎啟動...");

    const engData = [
        { q: "She ___ to the store yesterday.", a: "went", opts: ["go", "goes", "gone"], tag: ["grammar", "past_tense"] },
        { q: "He is ___ interested in music.", a: "very", opts: ["much", "many", "a lot"], tag: ["grammar", "adverbs"] },
        { q: "The apple is ___ the table.", a: "on", opts: ["in", "at", "of"], tag: ["grammar", "prepositions"] },
        { q: "Look! It ___ raining.", a: "is", opts: ["are", "was", "were"], tag: ["grammar", "present_continuous"] },
        { q: "I have ___ been to Japan.", a: "never", opts: ["ever", "yet", "since"], tag: ["grammar", "perfect_tense"] }
    ];

    engData.forEach((item, idx) => {
        const generatorFunc = (ctx, rnd) => {
            const allOpts = [item.a, ...item.opts];
            const shuffledOpts = allOpts.sort(() => 0.5 - Math.random());
            
            return {
                question: `Choose the correct word: "${item.q}"`,
                options: shuffledOpts,
                answer: shuffledOpts.indexOf(item.a),
                concept: item.tag[0],
                subject: "english",
                tags: ["english", "eng", ...item.tag]
            };
        };

        generatorFunc.subject = "english";
        generatorFunc.tags = ["english", "eng", ...item.tag];

        const id = `eng_q_${idx}_safe`;
        window.__ENGLISH_REPO__[id] = {
            func: generatorFunc,
            tags: generatorFunc.tags,
            subject: "english"
        };
    });

    console.log(`🎉 英文題庫 (V8.0) 已存入避難所，共 ${Object.keys(window.__ENGLISH_REPO__).length} 題。`);

})(window);
