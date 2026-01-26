(function(global){
    'use strict';
    console.log("⚖️ [Civics V8.5] 公民核心資料庫啟動...");

    window.__CIVICS_REPO__ = window.__CIVICS_REPO__ || {};
    
    const Utils = {
        shuffle: (arr) => arr.sort(() => Math.random() - 0.5),
        getImg: (item) => ``
    };

    const civicsDB = [
        // [社會]
        { t:["國七","社會"], e:"性別刻板印象", y:"男主外女主內", d:"社會對特定性別的既定看法，應予以打破。" },
        { t:["國七","社會"], e:"家庭功能", y:"社會化", d:"家庭是個人最早接觸的社會化機構，培養基本生活規範。" },
        
        // [政治]
        { t:["國八","政治"], e:"主權", y:"最高且獨立", d:"國家在國際上獨立自主，對內擁有最高統治權。" },
        { t:["國八","政治"], e:"基本人權", y:"參政權", d:"人民參與政治的權利，如選舉、罷免、創制、複決。" },
        { t:["高一","政治"], e:"內閣制", y:"虛位元首", d:"行政首長由國會多數黨領袖擔任，需對國會負責。" },

        // [法律]
        { t:["國八","法律"], e:"憲法", y:"最高性", d:"國家根本大法，法律與命令不得牴觸憲法。" },
        { t:["國九","法律"], e:"刑法", y:"罪刑法定主義", d:"行為之處罰，以行為時之法律有明文規定者為限。" },
        { t:["國九","法律"], e:"民法", y:"私法自治", d:"規範私人權利義務關係，原則上尊重當事人意願。" },
        { t:["高二","法律"], e:"權利救濟", y:"訴願", d:"人民對行政處分不服時，向行政機關提起的救濟途徑。" },

        // [經濟]
        { t:["國九","經濟"], e:"機會成本", y:"代價最高者", d:"做出選擇時，所放棄的選項中價值最高者。" },
        { t:["國九","經濟"], e:"需求法則", y:"價格與數量反向", d:"價格上升時需求量減少，價格下降時需求量增加。" },
        { t:["高二","經濟"], e:"外部效果", y:"社會成本", d:"經濟行為對第三方造成未計入市場交易的影響（如汙染）。" },
        { t:["高二","經濟"], e:"GDP", y:"國內生產毛額", d:"一國境內在一定期間內，生產最終財貨與勞務的總市值。" }
    ];

    civicsDB.forEach((item, idx) => {
        const id = `civics_${idx}`;
        const tags = ["civics", "公民", ...item.t];
        const func = () => {
            const others = Utils.shuffle(civicsDB.filter(x => x.e !== item.e)).slice(0, 3);
            const opts = Utils.shuffle([item.y, ...others.map(x => x.y)]);
            return {
                question: `【${item.t[1]}】關於「${item.e}」的概念，下列敘述何者最為精確？`,
                options: opts,
                answer: opts.indexOf(item.y),
                concept: item.t[1],
                explanation: [`正確答案：${item.y}`, `解釋：${item.d}`, Utils.getImg(item)],
                subject: "civics",
                tags: tags
            };
        };
        func.subject = "civics";
        func.tags = tags;
        window.__CIVICS_REPO__[id] = { func, tags, subject: "civics" };
    });
})(window);
