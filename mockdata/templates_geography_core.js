(function(global){
    'use strict';
    console.log("🌏 [Geography V9.0] 地理核心題庫 (地形/氣候/區域) 啟動...");

    window.__GEOGRAPHY_REPO__ = window.__GEOGRAPHY_REPO__ || {};

    const Utils = {
        shuffle: (arr) => arr.sort(() => Math.random() - 0.5),
        rnd: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
    };

    // =================================================================
    // 工廠 A: 氣候數據判讀 (自動生成 15 題)
    // =================================================================
    // 邏輯：根據氣溫與降雨特徵，反推氣候類型
    const climateTypes = [
        {name: "熱帶雨林", t: "全年高溫", r: "全年多雨", desc: "赤道附近，對流雨旺盛"},
        {name: "熱帶沙漠", t: "全年高溫", r: "全年少雨", desc: "副熱帶高壓籠罩，蒸發強烈"},
        {name: "地中海型", t: "夏熱冬溫", r: "夏乾冬雨", desc: "夏受高壓控制，冬受西風吹拂"},
        {name: "溫帶海洋性", t: "終年溫和", r: "全年有雨", desc: "終年西風吹拂，年溫差小"},
        {name: "溫帶季風", t: "夏熱冬寒", r: "夏雨冬乾", desc: "海陸性質差異大，四季分明"}
    ];

    for(let i=0; i<15; i++) {
        const c = climateTypes[i % climateTypes.length];
        const id = `geo_clim_${i}`;
        const tags = ["geography", "地理", "氣候", "國七", "國九"];

        const func = () => {
            // 生成干擾項
            const others = Utils.shuffle(climateTypes.filter(x => x.name !== c.name)).slice(0, 3).map(x => x.name);
            const opts = Utils.shuffle([c.name, ...others]);
            
            return {
                question: `【氣候判讀】某地的氣候特徵為「${c.t}、${c.r}」。請問該地最可能屬於何種氣候類型？`,
                options: opts,
                answer: opts.indexOf(c.name),
                explanation: [
                    `正確答案：${c.name}`,
                    `特徵分析：${c.desc}`,
                    ``
                ],
                subject: "geography", tags: tags
            };
        };
        window.__GEOGRAPHY_REPO__[id] = { func, tags, subject: "geography" };
    }

    // =================================================================
    // 工廠 B: 地形與成因配對 (20 題)
    // =================================================================
    const landforms = [
        {f: "V型谷", reason: "河流侵蝕 (下切)", place: "河川上游"},
        {f: "U型谷", reason: "冰川侵蝕", place: "高緯度或高山"},
        {f: "三角洲", reason: "河流堆積", place: "河川出海口"},
        {f: "沖積扇", reason: "河流堆積", place: "谷口 (山麓)"},
        {f: "沙洲/潟湖", reason: "波浪與沿岸流堆積", place: "沙岸地區"},
        {f: "海蝕洞/崖", reason: "波浪侵蝕", place: "岩岸地區"},
        {f: "鐘乳石", reason: "地下水溶蝕 (石灰岩)", place: "喀斯特地形"},
        {f: "火山錐", reason: "岩漿噴發堆積", place: "板塊交界"},
        {f: "斷層崖", reason: "板塊擠壓斷裂", place: "斷層帶"},
        {f: "沙丘", reason: "風力堆積", place: "沙漠或海邊"}
    ];

    landforms.forEach((item, idx) => {
        // 變體 1: 問成因
        const id1 = `geo_land_1_${idx}`;
        const tags1 = ["geography", "地理", "地形", "國七"];
        window.__GEOGRAPHY_REPO__[id1] = {
            func: () => {
                const wr = Utils.shuffle(landforms.filter(x => x.reason !== item.reason)).slice(0, 3).map(x => x.reason);
                const opts = Utils.shuffle([item.reason, ...wr]);
                return {
                    question: `【地形】造成「${item.f}」的主要地質營力為何？`,
                    options: opts,
                    answer: opts.indexOf(item.reason),
                    explanation: [`${item.f} 是由 ${item.reason} 形成的。`, ``],
                    subject: "geography", tags: tags1
                };
            }, tags: tags1, subject: "geography"
        };

        // 變體 2: 問位置
        const id2 = `geo_land_2_${idx}`;
        const tags2 = ["geography", "地理", "地形", "國七"];
        window.__GEOGRAPHY_REPO__[id2] = {
            func: () => {
                const wr = Utils.shuffle(landforms.filter(x => x.place !== item.place)).slice(0, 3).map(x => x.place);
                const opts = Utils.shuffle([item.place, ...wr]);
                return {
                    question: `【地形】通常我們可以在哪裡觀察到「${item.f}」？`,
                    options: opts,
                    answer: opts.indexOf(item.place),
                    explanation: [`${item.f} 常見於 ${item.place}。`, ``],
                    subject: "geography", tags: tags2
                };
            }, tags: tags2, subject: "geography"
        };
    });

    // =================================================================
    // 工廠 C: 區域地理與產業 (15 題)
    // =================================================================
    const regions = [
        {q: "台灣人口分佈的主要特徵？", a: "西部多於東部，平原多於山地", t: "台灣"},
        {q: "中國的人口地理分界線是？", a: "黑河 - 騰衝線", t: "中國"},
        {q: "東南亞國家中，唯一未曾淪為殖民地的是？", a: "泰國", t: "亞洲"},
        {q: "素有「歐洲火藥庫」之稱的半島是？", a: "巴爾幹半島", t: "歐洲"},
        {q: "目前世界面積最大的熱帶雨林位於？", a: "亞馬遜盆地 (巴西)", t: "美洲"},
        {q: "台灣主要的河川流向為何？", a: "東西分流 (注入台灣海峽或太平洋)", t: "台灣"},
        {q: "矽谷 (Silicon Valley) 位於美國何處？", a: "加州 (舊金山灣區)", t: "美洲"},
        {q: "下列何者是澳洲主要的出口礦產？", a: "煤礦與鐵礦", t: "大洋洲"}
    ];

    regions.forEach((item, idx) => {
        const id = `geo_reg_${idx}`;
        const tags = ["geography", "地理", item.t, "國八", "國九"]; // 廣泛標籤
        window.__GEOGRAPHY_REPO__[id] = {
            func: () => {
                // 這裡的選項比較難自動生成，我們用通用干擾項或寫死
                const commonWrongs = ["人口平均分佈", "秦嶺淮河線", "越南", "伊比利半島", "剛果盆地", "南北向", "紐約", "石油"];
                const wr = Utils.shuffle(commonWrongs.filter(x => x !== item.a)).slice(0, 3);
                const opts = Utils.shuffle([item.a, ...wr]);
                return {
                    question: `【${item.t}】${item.q}`,
                    options: opts,
                    answer: opts.indexOf(item.a),
                    explanation: [`正確答案：${item.a}`, ``],
                    subject: "geography", tags: tags
                };
            }, tags: tags, subject: "geography"
        };
    });

})(window);
