(function (global) {
  'use strict';

  function init() {
    const G = global.RigorousGenerator || window.global?.RigorousGenerator;
    if (!G || !G.registerTemplate) return setTimeout(init, 100);

    const { pick, shuffle } = G.utils;
    const gradeOrder = ["國七", "國八", "國九", "高一"];

    function allow(item, ctx) {
      const g = ctx.tags.find(t => gradeOrder.includes(t));
      if (!g) return false;

      return g.startsWith("國")
        ? item.t[0] === g
        : gradeOrder.indexOf(item.t[0]) <= gradeOrder.indexOf(g);
    }

    const db = [
      // ----------------------------------------------------
      // [地理] (Physical & Human)
      // ----------------------------------------------------
      { s:"地理", t:["國七","地形"], e:"河谷地形", y:"V型谷", d:"河流上游侵蝕力強，下切形成深谷" },
      { s:"地理", t:["國七","地形"], e:"沖積扇", y:"扇狀堆積", d:"河流出谷口流速減緩，泥沙堆積成扇狀" },
      { s:"地理", t:["國七","地形"], e:"三角洲", y:"河口堆積", d:"河流入海處流速極慢，泥沙堆積成三角形" },
      { s:"地理", t:["國七","地形"], e:"石灰岩地形", y:"喀斯特", d:"地下水溶蝕石灰岩層形成的特殊地形" },
      { s:"地理", t:["國七","地形"], e:"沙洲與潟湖", y:"波浪堆積", d:"沿岸流與波浪搬運堆積形成的海積地形" },
      { s:"地理", t:["國七","氣候"], e:"季風氣候", y:"夏雨冬乾", d:"夏季吹海風多雨，冬季吹陸風乾燥" },
      { s:"地理", t:["國七","氣候"], e:"地形雨", y:"迎風坡多雨", d:"氣流受山脈阻擋抬升，冷卻凝結降雨" },
      { s:"地理", t:["國七","產業"], e:"集約農業", y:"投入多產出高", d:"單位面積投入大量勞力與資金的農業" },

      { s:"地理", t:["國八","中國"], e:"黃土高原", y:"窯洞", d:"土質疏鬆，水土流失嚴重" },
      { s:"地理", t:["國八","中國"], e:"坎兒井", y:"乾燥氣候", d:"減少水分蒸發的地下水利設施" },
      { s:"地理", t:["國八","中國"], e:"長江三角洲", y:"水鄉澤國", d:"河網密布，經濟發達" },

      { s:"地理", t:["國九","世界"], e:"熱帶雨林", y:"亞馬遜", d:"全年高溫多雨，生物多樣性高" },
      { s:"地理", t:["國九","世界"], e:"熱帶莽原", y:"乾溼分明", d:"乾溼季明顯的熱帶草原氣候" },
      { s:"地理", t:["國九","世界"], e:"地中海型氣候", y:"夏乾冬雨", d:"夏季乾燥，冬季多雨" },
      { s:"地理", t:["國九","世界"], e:"溫帶海洋性氣候", y:"全年有雨", d:"終年溫和濕潤" },

      { s:"地理", t:["高一","地圖"], e:"麥卡托投影", y:"角度正確", d:"適合航海，但高緯度變形嚴重" },
      { s:"地理", t:["高一","地圖"], e:"等高線", y:"地形起伏", d:"顯示地表高低與坡度" },
      { s:"地理", t:["高一","GIS"], e:"向量資料", y:"點線面", d:"以幾何圖形儲存空間資料" },
      { s:"地理", t:["高一","GIS"], e:"網格資料", y:"像元", d:"以網格方式儲存連續數值" }
    ];

    G.registerTemplate("geo_basic", (ctx) => {
      const pool = db.filter(x => allow(x, ctx));
      if (!pool.length) return null;

      const item = pick(pool);
      const opts = shuffle([
        item.y,
        ...shuffle(pool.filter(x => x !== item)).slice(0, 3).map(x => x.y)
      ]);

      return {
        question: `【地理】關於「${item.e}」，下列何者正確？`,
        options: opts,
        answer: opts.indexOf(item.y),
        concept: item.t[1],
        explanation: [`${item.e}：${item.d}`]
      };
    }, ["地理","國七","國八","國九","高一"]);

    console.log("✅ 地理題庫載入完成");
  }

  init();
})(window);
