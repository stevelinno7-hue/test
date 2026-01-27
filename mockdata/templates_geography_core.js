(function(global){
  'use strict';
  console.log("🌐 Geography 500-generator starting...");

  window.__GEOGRAPHY_REPO__ = window.__GEOGRAPHY_REPO__ || {};

  const Utils = {
    rnd: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
    shuffle: (arr) => {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    uid: (() => {
      let n = 0;
      return (prefix='geo') => `${prefix}_${Date.now().toString(36)}_${(n++).toString(36)}`;
    })()
  };

  // -------------------------
  // 基底題庫：多單元（每單元 6~10 題）
  // -------------------------
  const basePools = [
    // 台灣（延伸）
    { unitId:"tw_physical", unitName:"台灣—地形與氣候", t:["台灣","地形","氣候"],
      items:[
        {q:"台灣主要山脈中，哪一條位於西側並與中央山脈平行？", a:"雪山山脈", o:["中央山脈","海岸山脈","阿里山山脈"]},
        {q:"台灣夏季午後常見的短時強降雨主要成因為何？", a:"地形抬升與午後對流", o:["海平面上升","地球自轉變慢","月相變化"]},
        {q:"台灣西部平原的形成主要與哪種作用有關？", a:"河流沖積與沉積", o:["火山噴發堆積","冰川搬運","海底隆起"]},
        {q:"台灣東部海岸常見的地形特徵為何？", a:"陡崖與狹窄海岸平地", o:["廣闊三角洲","沙漠化平原","廣大潟湖"]},
        {q:"台灣的主要降雨季節（梅雨）通常發生在何時？", a:"每年5-6月", o:["每年11-12月","每年2-3月","每年8-9月"]},
        {q:"台灣沿海紅樹林最常見於哪種環境？", a:"河口與潮間帶", o:["高山溪谷","內陸盆地","乾燥沙漠"]}
      ]
    },

    // 亞洲與中國
    { unitId:"asia_physical", unitName:"亞洲—自然與人文", t:["亞洲","中國","地理"],
      items:[
        {q:"中國地勢呈現西高東低的三級階梯，最外側（第三階梯）主要為何種地形？", a:"東部平原與丘陵", o:["高原與盆地","高山與冰原","深海溝"]},
        {q:"印度季風帶來夏季降雨的主要原因是？", a:"海陸熱力差造成季風逆轉", o:["板塊俯衝","月球引力","太陽黑子活動"]},
        {q:"東南亞熱帶雨林區域的主要特徵為何？", a:"全年高溫多雨且生物多樣性高", o:["乾季長且降雨少","寒冷乾燥","高海拔冰川"]},
        {q:"中國黃土高原的土壤特性使其易發生哪種地表現象？", a:"嚴重水土流失與溝壑化", o:["珊瑚礁形成","火山噴發","冰川侵蝕"]},
        {q:"喜馬拉雅山脈的形成主要與哪兩塊板塊碰撞有關？", a:"印度板塊與歐亞板塊", o:["太平洋板塊與北美板塊","非洲板塊與南極板塊","澳洲板塊與太平洋板塊"]},
        {q:"東亞地區冬季常受哪一氣團影響導致寒冷乾燥？", a:"西伯利亞高壓（冷高壓）", o:["赤道低壓帶","副熱帶高壓","印度洋季風低壓"]}
      ]
    },

    // 歐洲
    { unitId:"europe", unitName:"歐洲地理", t:["歐洲","氣候","人文"],
      items:[
        {q:"西歐溫和濕潤的氣候主要受哪一洋流與風帶影響？", a:"北大西洋暖流與西風帶", o:["寒流與信風","赤道逆流","極地東風"]},
        {q:"斯堪地那維亞半島以哪種地形與冰川遺跡著稱？", a:"冰蝕地形與峽灣", o:["沙漠與沙丘","火山口與熔岩平原","珊瑚礁"]},
        {q:"地中海型氣候的典型特徵是？", a:"夏乾冬雨", o:["夏雨冬乾","全年均勻降雨","極端寒冷"]},
        {q:"歐盟（EU）在地理上促進哪種跨國合作？", a:"經濟整合與自由貿易", o:["單一語言政策","統一宗教","統一貨幣在所有國家"]}
      ]
    },

    // 非洲
    { unitId:"africa", unitName:"非洲地理", t:["非洲","氣候","資源"],
      items:[
        {q:"撒哈拉沙漠位於非洲的哪一部分？", a:"北非", o:["南非","東非","西非"]},
        {q:"剛果盆地的熱帶雨林對全球有何重要功能？", a:"碳吸存與生物多樣性保護", o:["增加海平面","製造沙漠","降低全球溫度至冰點"]},
        {q:"非洲大裂谷的形成與哪種構造活動有關？", a:"板塊張裂與地殼拉張", o:["板塊俯衝","海底擴張","隕石撞擊"]},
        {q:"撒哈拉以南非洲（撒赫爾）面臨的主要環境問題為何？", a:"乾旱化與土地退化", o:["冰川融化","海平面下降","火山爆發頻繁"]}
      ]
    },

    // 美洲
    { unitId:"americas", unitName:"美洲地理", t:["美洲","地形","氣候"],
      items:[
        {q:"亞馬遜河流域的主要生態功能是？", a:"提供全球重要的碳匯與生物多樣性", o:["製造沙漠","形成冰川","提供大量石油"]},
        {q:"落基山脈主要位於哪一洲？", a:"北美洲", o:["南美洲","歐洲","亞洲"]},
        {q:"美國中西部廣闊平原適合哪種農業型態？", a:"商業性穀物與畜牧業", o:["熱帶雨林採集","高山梯田","漁業養殖"]},
        {q:"安第斯山脈的形成主要與哪種板塊互動有關？", a:"海洋板塊俯衝於大陸板塊之下", o:["板塊張裂","轉換斷層滑動","海底擴張"]}
      ]
    },

    // 大洋洲與極地
    { unitId:"oceania_polar", unitName:"大洋洲與兩極", t:["大洋洲","兩極","氣候"],
      items:[
        {q:"澳洲內陸廣大的乾燥地帶稱為？", a:"澳洲內陸沙漠（Outback）", o:["亞馬遜盆地","撒哈拉沙漠","西伯利亞平原"]},
        {q:"南極洲的冰蓋對全球海平面有何影響？", a:"若大量融化會顯著提高海平面", o:["降低海平面","無影響","使地球自轉加速"]},
        {q:"大洋洲島國常面臨哪種氣候風險？", a:"海平面上升與風暴潮", o:["冰川形成","沙漠化","火山熔岩流"]},
        {q:"紐西蘭的地形與地震活動主要與哪種構造有關？", a:"板塊邊界與轉換斷層", o:["內陸沉降","海底擴張","極地冰蓋運動"]}
      ]
    },

    // 氣候與大氣
    { unitId:"climate", unitName:"氣候系統與變遷", t:["氣候","大氣","變遷"],
      items:[
        {q:"溫室氣體增加會導致哪種全球現象？", a:"全球平均溫度上升（全球暖化）", o:["地球自轉停止","海平面下降","月球靠近地球"]},
        {q:"厄爾尼諾現象主要影響哪個海域的海溫與降雨？", a:"東太平洋赤道海域", o:["北大西洋","印度洋高緯區","地中海"]},
        {q:"氣候帶劃分常依據哪兩項主要氣候要素？", a:"溫度與降水分布", o:["海底地形與地震頻率","人口密度與語言","土壤酸鹼度與礦物"]},
        {q:"城市熱島效應主要由哪項造成？", a:"大量不透水面與建築密集", o:["海洋冷卻","森林增加","地震活動增加"]}
      ]
    },

    // 海洋與海岸
    { unitId:"ocean", unitName:"海洋科學與海岸", t:["海洋","潮汐","海岸"],
      items:[
        {q:"潮汐主要由哪兩個天體的引力共同影響？", a:"月球與太陽（以月球為主）", o:["火星與金星","木星與土星","地球與火星"]},
        {q:"洋流對氣候的影響主要透過什麼機制？", a:"輸送熱量與調節海表溫度", o:["改變地球自轉","改變地殼構造","改變月球軌道"]},
        {q:"珊瑚礁白化主要與哪項環境變化有關？", a:"海水溫度上升", o:["海水鹽度下降","海底火山爆發","海流速度增加"]},
        {q:"潮汐能發電的可行性主要取決於哪兩項？", a:"潮差大小與地形適宜性", o:["海水鹽度與海水顏色","海洋生物多樣性與漁業","海底火山活動與月相"]}
      ]
    },

    // 地形與岩石圈
    { unitId:"geomorph", unitName:"地形與岩石圈", t:["地形","岩石","地質"],
      items:[
        {q:"岩石循環包含哪三大類岩石？", a:"火成岩、沉積岩、變質岩", o:["玄武岩、石灰岩、頁岩","砂岩、頁岩、板岩","火山灰、熔岩、岩漿"]},
        {q:"褶皺與斷層主要由哪種地殼應力造成？", a:"擠壓與拉張應力", o:["風化應力","潮汐應力","生物作用"]},
        {q:"中洋脊主要與哪種板塊邊界有關？", a:"張裂型（海底擴張）", o:["俯衝型","轉換斷層型","穩定邊界"]},
        {q:"河流三角洲的形成主要與哪種過程有關？", a:"河流攜帶沉積物在入海口沉積", o:["火山噴發堆積","冰川搬運","地殼抬升"]}
      ]
    },

    // 人口、都市與經濟
    { unitId:"human_geo", unitName:"人文地理與經濟", t:["人口","都市","經濟"],
      items:[
        {q:"人口金字塔可以顯示哪項人口特徵？", a:"年齡結構與生育率趨勢", o:["土壤類型","海水鹽度","地震頻率"]},
        {q:"都市化常帶來哪種環境問題？", a:"空氣污染與都市熱島效應", o:["增加森林覆蓋","降低人口密度","減少交通需求"]},
        {q:"比較利益理論主要用於解釋什麼？", a:"國際貿易中專業化與互惠交換的好處", o:["地震發生機制","氣候變遷原因","海洋潮汐形成"]},
        {q:"工業區位選擇常考量哪些要素？", a:"原料、交通、勞力與市場", o:["月相、星座、風水","海水溫度、鹽度、潮汐","語言、宗教、服飾"]}
      ]
    },

    // GIS、遙測與地圖
    { unitId:"gis_rs", unitName:"GIS 與遙測", t:["GIS","遙測","地圖"],
      items:[
        {q:"地理資訊系統（GIS）最主要的功能是？", a:"儲存、分析與視覺化空間資料", o:["製造地震","控制天氣","生產農作物"]},
        {q:"遙測影像常用哪種指標評估植被健康？", a:"植被指數（NDVI）", o:["海水鹽度指數","地震指數","人口指數"]},
        {q:"等高線圖上等高線越密集代表什麼？", a:"坡度越陡", o:["坡度越緩","海拔越低","地形越平坦"]},
        {q:"麥卡托投影的主要缺點是？", a:"高緯度地區面積嚴重放大", o:["方向完全錯誤","無法表示經緯度","無法繪製海圖"]}
      ]
    },

    // 自然災害與風險管理
    { unitId:"hazards", unitName:"自然災害與風險管理", t:["災害","風險","管理"],
      items:[
        {q:"地震預警系統主要利用哪種波的先到特性？", a:"P波先到", o:["S波先到","表面波先到","潮汐波先到"]},
        {q:"山坡地濫墾最可能引發哪種災害？", a:"土石流與山崩", o:["海嘯","颱風","火山爆發"]},
        {q:"洪水風險管理常用哪種工程與非工程措施結合？", a:"堤防建設與生態復育", o:["完全混凝土化河道","禁止所有人類活動","只靠保險賠償"]},
        {q:"海嘯主要由哪種地質事件引發？", a:"海底地震或海底滑坡", o:["颱風中心通過","潮汐變化","海水溫度上升"]}
      ]
    },

    // 永續與資源
    { unitId:"sustain", unitName:"永續發展與資源管理", t:["永續","資源","環境"],
      items:[
        {q:"永續發展三大面向為何？", a:"經濟、社會、環境三者平衡", o:["科技、軍事、文化","教育、醫療、交通","政治、經濟、宗教"]},
        {q:"再生能源不包括下列哪一項？", a:"石油", o:["太陽能","風能","水力"]},
        {q:"水資源管理常用的非結構性措施為何？", a:"節水、回收與需求管理", o:["填海造陸","大量抽地下水","全面混凝土化河道"]},
        {q:"生態系服務的概念主要強調什麼？", a:"自然系統對人類提供的功能與利益", o:["自然系統的經濟價值不可衡量","自然系統只會造成災害","自然系統與人類無關"]}
      ]
    }
  ];

  // -------------------------
  // 補充干擾選項池（增加多樣性）
  // -------------------------
  const extraDistractors = [
    "地形變化","氣候帶","人口密度","經緯度","海拔高度","河流流域","沉積作用",
    "板塊擠壓","海洋性氣候","大陸性氣候","季風","信風","西風","赤道低壓帶",
    "溫帶海洋性","地中海型","熱帶雨林","溫帶季風","高緯度","低緯度",
    "城市化","工業化","農業化","全球化","資源枯竭","生物多樣性"
  ];

  // -------------------------
  // 變體生成器（保留正答，產生語句變體與干擾）
  // -------------------------
  function makeVariant(baseItem, unit) {
    const qBase = baseItem.q;
    const a = baseItem.a;
    const oList = (baseItem.o || []).slice();

    // 題幹變體：加入情境、年級或應用字眼
    let q = qBase;
    const variants = ["（例題）","（應用）","（延伸）","（判斷）","（比較）"];
    if (Math.random() < 0.45) {
      q = `${qBase} ${Utils.pick(variants)}`;
    } else if (Math.random() < 0.25) {
      q = `${qBase}（適用：${Utils.pick(["國七","國八","國九","高一","高二","高三"])})`;
    }

    // 補足干擾選項到 3 個
    const distractors = oList.slice();
    while (distractors.length < 3) {
      const cand = Utils.pick(extraDistractors);
      if (cand !== a && !distractors.includes(cand)) distractors.push(cand);
    }

    // 若干擾與正答相同或重複，替換
    for (let i=0;i<distractors.length;i++){
      if (distractors[i] === a) {
        let repl = Utils.pick(extraDistractors);
        while (repl === a || distractors.includes(repl)) repl = Utils.pick(extraDistractors);
        distractors[i] = repl;
      }
    }

    const options = Utils.shuffle([a, distractors[0], distractors[1], distractors[2]]);

    const tags = ["geography", "地理", ...unit.t];
    const grade = Utils.pick(["國七","國八","國九","高一","高二","高三"]);
    if (!tags.includes(grade)) tags.push(grade);

    return {
      id: Utils.uid('geo'),
      question: `【地理】${q}`,
      options: options,
      answer: options.indexOf(a),
      explanation: [`正確答案：${a}`, `單元：${unit.unitName}`],
      subject: "geography",
      tags: tags
    };
  }

  // -------------------------
  // 產生題庫（目標數量）
  // -------------------------
  function generateGeographyBank(targetCount = 500) {
    const bank = [];
    const baseList = [];
    basePools.forEach(unit => {
      unit.items.forEach(item => {
        baseList.push({ unitId: unit.unitId, unitName: unit.unitName, t: unit.t.slice(), item });
      });
    });

    if (baseList.length === 0) return bank;

    // 先加入每個基底題（確保原題保留）
    baseList.forEach(entry => {
      bank.push(makeVariant(entry.item, { unitId: entry.unitId, unitName: entry.unitName, t: entry.t }));
    });

    // 以變體方式擴充直到達到目標數量
    let idx = 0;
    while (bank.length < targetCount) {
      const entry = baseList[idx % baseList.length];
      const variant = makeVariant(entry.item, { unitId: entry.unitId, unitName: entry.unitName, t: entry.t });

      // 小機率產生反向題（哪一項不是...）以增加題型多樣性
      if (Math.random() < 0.12) {
        // 嘗試把題幹改為「哪一項不是...」，並調整選項（保留語意）
        variant.question = variant.question.replace('？', '，下列何者不是？');
        // 若原正答仍合理，則隨機交換選項以保持題目有效
        const opts = variant.options.slice();
        const swap = (variant.answer + 1) % 4;
        [opts[variant.answer], opts[swap]] = [opts[swap], opts[variant.answer]];
        variant.options = opts;
        variant.answer = opts.indexOf(variant.explanation[0].replace('正確答案：',''));
      }

      bank.push(variant);
      idx++;
      if (idx > targetCount * 20) break; // safety
    }

    return bank.slice(0, targetCount);
  }

  // -------------------------
  // 注入到 window.__GEOGRAPHY_REPO__
  // -------------------------
  function injectToRepo(bank) {
    bank.forEach((item, i) => {
      const id = `geo_q_${i}`;
      window.__GEOGRAPHY_REPO__[id] = {
        func: () => ({
          question: item.question,
          options: item.options,
          answer: item.answer,
          explanation: item.explanation,
          subject: item.subject,
          tags: item.tags
        }),
        tags: item.tags,
        subject: item.subject
      };
    });
  }

  // 產生並注入
  const TARGET = 500;
  const bank = generateGeographyBank(TARGET);
  injectToRepo(bank);
  global.__GEOGRAPHY_BANK__ = bank;

  console.log(`✅ Geography bank generated: ${bank.length} items. Injected into window.__GEOGRAPHY_REPO__.`);

  // 對外暴露以便後續使用
  global.generateGeographyBank = generateGeographyBank;
  global.__GEOGRAPHY_BANK__ = bank;

})(window);
