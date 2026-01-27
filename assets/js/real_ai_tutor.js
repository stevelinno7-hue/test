/* =====================================================
 * RealAITutor - 完整程式（含 100 種 subjectSeeds 與自動擴充 knowledgeBase）
 * 會產生 200 筆 knowledgeBase 條目並合併到 RealAITutor.knowledgeBase
 * ===================================================== */

const RealAITutor = {
  settings: {
    name: "AI 智能助教",
    version: "Mock-Ultimate-v3.1-full",
    minLatency: 1500,
    maxLatency: 3000,
    debugMode: true
  },

  state: {
    history: [],
    lastTopic: null
  },

  // 初始 knowledgeBase（保留一個範例條目）
  knowledgeBase: [
    {
      category: "math_algebra",
      keywords: ["方程式","代數","函數","根號","多項式"],
      generate: (topic) => {
        return `📘 **【AI 數學解析】**\n\n關於 **${topic}**，建議先檢查是否符合標準形式：\n\n$$ ax^2 + bx + c = 0 $$\n\n再用公式解：\n\n$$ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$`;
      }
    }
  ],

  fallbackResponses: [
    "📘 **【AI 助教】**\n\n我注意到了你對 **{{topic}}** 的疑問。\n\n這個概念稍微複雜一些，為了給你最精準的協助，你可以提供題目截圖或更具體的文字敘述嗎？",
    "📘 **【AI 學習夥伴】**\n\n嗨！關於 **{{topic}}**，這通常是考試的重點呢！請告訴我你卡在哪個步驟。"
  ],

  logThought(step, message) {
    if (this.settings.debugMode) {
      console.log(`[AI Core] ${step}:`, message);
    }
  },

  extractTopic(title, content) {
    const fullText = (title || "") + " " + (content || "");
    const meaningfulWords = fullText
      .split(/[\s,?.!，。？！]+/)
      .filter(w => w.length > 1 && !["請問","怎麼","什麼","這個","覺得","不會","教我"].includes(w));
    return meaningfulWords.length > 0 ? meaningfulWords[0] : "這個問題";
  },

  async askGemini(title, content) {
    this.logThought("Input Received", { title, content });
    const delay = Math.floor(Math.random() * (this.settings.maxLatency - this.settings.minLatency + 1)) + this.settings.minLatency;
    this.logThought("Thinking", `Simulating neural processing... (${delay}ms)`);
    await new Promise(resolve => setTimeout(resolve, delay));

    const topic = this.extractTopic(title, content);
    this.state.lastTopic = topic;
    this.logThought("Topic Extraction", `Identified topic: "${topic}"`);

    const combinedText = (title + " " + content).toLowerCase();
    let selectedGenerator = null;
    let matchedCategory = "unknown";

    for (const kb of this.knowledgeBase) {
      if (kb.keywords.some(k => combinedText.includes(k))) {
        selectedGenerator = kb.generate;
        matchedCategory = kb.category;
        break;
      }
    }

    let finalResponse = "";
    if (selectedGenerator) {
      this.logThought("Knowledge Retrieval", `Hit category: ${matchedCategory}`);
      finalResponse = selectedGenerator(topic);
    } else {
      this.logThought("Fallback", "No specific category match. Using generic conversational engine.");
      const fallbackTemplate = this.fallbackResponses[Math.floor(Math.random() * this.fallbackResponses.length)];
      finalResponse = fallbackTemplate.replace("{{topic}}", topic);
    }

    this.state.history.push({
      timestamp: new Date(),
      q: title,
      a: finalResponse
    });

    this.logThought("Output", "Response delivered successfully.");
    return finalResponse;
  },

  clearHistory() {
    this.state.history = [];
    this.logThought("System", "Memory wiped.");
  }
};

/* =============================================================
 * subjectSeeds: 100 種主題種子（每個含 name 與 keywords）
 * ============================================================= */
const subjectSeeds = [
  { name: "math_algebra", keywords: ["方程式","代數","函數","多項式"] },
  { name: "math_geometry", keywords: ["三角形","圓形","面積","角度"] },
  { name: "math_calculus", keywords: ["微分","積分","極限","導數"] },
  { name: "math_linear_algebra", keywords: ["矩陣","向量","行列式","特徵值"] },
  { name: "math_probability", keywords: ["機率","隨機","分布","事件"] },
  { name: "math_statistics", keywords: ["平均數","標準差","抽樣","假設檢定"] },
  { name: "math_number_theory", keywords: ["質數","同餘","整數","因數"] },
  { name: "math_discrete", keywords: ["圖論","組合","離散數學","遞迴"] },
  { name: "physics_mechanics", keywords: ["牛頓","力","加速度","動量"] },
  { name: "physics_kinematics", keywords: ["速度","位移","時間","運動方程"] },
  { name: "physics_dynamics", keywords: ["力矩","平衡","摩擦","轉動"] },
  { name: "physics_thermo", keywords: ["熱力學","溫度","熵","熱平衡"] },
  { name: "physics_waves", keywords: ["波動","頻率","振幅","干涉"] },
  { name: "physics_optics", keywords: ["光學","折射","反射","透鏡"] },
  { name: "physics_electricity", keywords: ["電壓","電流","電阻","電路"] },
  { name: "physics_magnetism", keywords: ["磁場","電磁感應","洛倫茲力"] },
  { name: "chemistry_general", keywords: ["原子","分子","元素","化學鍵"] },
  { name: "chemistry_stoichiometry", keywords: ["莫耳","反應式","濃度","滴定"] },
  { name: "chemistry_organic", keywords: ["烴類","官能基","取代反應","立體化學"] },
  { name: "chemistry_inorganic", keywords: ["金屬","配位化合物","酸鹼","氧化還原"] },
  { name: "chemistry_physical", keywords: ["熱化學","動力學","平衡","速率"] },
  { name: "biology_cell", keywords: ["細胞","細胞膜","核糖體","線粒體"] },
  { name: "biology_genetics", keywords: ["DNA","RNA","遺傳","孟德爾"] },
  { name: "biology_evolution", keywords: ["演化","自然選擇","物種","適應"] },
  { name: "biology_ecology", keywords: ["生態系","食物鏈","族群","生態平衡"] },
  { name: "biology_physiology", keywords: ["循環","呼吸","消化","神經"] },
  { name: "earth_geology", keywords: ["岩石","地層","板塊","地震"] },
  { name: "earth_meteorology", keywords: ["氣候","天氣","鋒面","氣壓"] },
  { name: "earth_astronomy", keywords: ["行星","恆星","銀河","天文觀測"] },
  { name: "chinese_literature", keywords: ["文言文","詩詞","修辭","成語"] },
  { name: "chinese_writing", keywords: ["作文","段落","論述","題旨"] },
  { name: "chinese_reading", keywords: ["閱讀理解","主旨","推論","細節"] },
  { name: "english_grammar", keywords: ["時態","被動語態","從句","動詞"] },
  { name: "english_vocabulary", keywords: ["單字","詞彙","同義","反義"] },
  { name: "english_reading", keywords: ["閱讀理解","主旨大意","細節題"] },
  { name: "english_writing", keywords: ["作文","段落結構","論證","過渡句"] },
  { name: "history_modern", keywords: ["戰爭","革命","殖民","冷戰"] },
  { name: "history_ancient", keywords: ["古代文明","朝代","考古","文化"] },
  { name: "civics_law", keywords: ["憲法","法律","權利","義務"] },
  { name: "economics_micro", keywords: ["供需","市場","價格","彈性"] },
  { name: "economics_macro", keywords: ["GDP","通膨","失業","貨幣政策"] },
  { name: "business_accounting", keywords: ["資產","負債","損益表","會計"] },
  { name: "business_marketing", keywords: ["市場調查","品牌","廣告","定位"] },
  { name: "computer_science_fundamentals", keywords: ["演算法","資料結構","複雜度","排序"] },
  { name: "programming_js", keywords: ["JavaScript","DOM","非同步","事件"] },
  { name: "programming_python", keywords: ["Python","函式","模組","資料處理"] },
  { name: "databases_sql", keywords: ["SQL","查詢","索引","正規化"] },
  { name: "networks", keywords: ["TCP","IP","路由","封包"] },
  { name: "security_cyber", keywords: ["加密","認證","漏洞","防火牆"] },
  { name: "ai_ml", keywords: ["機器學習","監督式","非監督式","模型"] },
  { name: "data_science", keywords: ["資料清理","視覺化","特徵工程","模型評估"] },
  { name: "robotics", keywords: ["感測器","致動器","控制","路徑規劃"] },
  { name: "electronics", keywords: ["電路","半導體","放大器","濾波"] },
  { name: "control_systems", keywords: ["反饋","穩定性","傳遞函數","PID"] },
  { name: "signal_processing", keywords: ["傅立葉","濾波","取樣","頻譜"] },
  { name: "optics_photonics", keywords: ["光子","雷射","干涉","光纖"] },
  { name: "thermodynamics", keywords: ["熱力學定律","熵","能量守恆","熱機"] },
  { name: "materials_science", keywords: ["金屬","陶瓷","聚合物","晶體"] },
  { name: "mechanical_engineering", keywords: ["力學","材料","設計","製造"] },
  { name: "civil_engineering", keywords: ["結構","橋梁","地基","施工"] },
  { name: "chemical_engineering", keywords: ["反應器","傳質","流體","熱交換"] },
  { name: "aerospace_engineering", keywords: ["氣動","推進","飛行力學","航太"] },
  { name: "industrial_engineering", keywords: ["生產排程","品質","效率","流程"] },
  { name: "environmental_science", keywords: ["污染","生態保育","資源管理","永續"] },
  { name: "agriculture", keywords: ["作物","土壤","灌溉","農業技術"] },
  { name: "marine_science", keywords: ["海洋生物","潮汐","海流","珊瑚"] },
  { name: "biotechnology", keywords: ["基因工程","發酵","生物製劑","克隆"] },
  { name: "genetics", keywords: ["基因型","表現型","突變","遺傳圖"] },
  { name: "immunology", keywords: ["免疫系統","抗體","疫苗","發炎"] },
  { name: "anatomy", keywords: ["器官","組織","系統","解剖"] },
  { name: "physiology", keywords: ["生理功能","恆定性","代謝","神經傳導"] },
  { name: "pharmacology", keywords: ["藥物作用","劑量","代謝","毒性"] },
  { name: "medicine_basics", keywords: ["診斷","病理","症狀","治療"] },
  { name: "nursing", keywords: ["護理程序","照護","評估","藥物管理"] },
  { name: "veterinary", keywords: ["動物醫學","疫病","獸醫手術","飼養"] },
  { name: "psychology", keywords: ["認知","行為","發展","人格"] },
  { name: "sociology", keywords: ["社會結構","文化","群體","社會變遷"] },
  { name: "philosophy", keywords: ["倫理","形上學","知識論","邏輯"] },
  { name: "logic_critical_thinking", keywords: ["推理","謬誤","論證","命題"] },
  { name: "law_intellectual_property", keywords: ["專利","著作權","商標","智慧財產"] },
  { name: "media_journalism", keywords: ["新聞寫作","媒體倫理","採訪","報導"] },
  { name: "public_speaking", keywords: ["演講","說服","肢體語言","聲音訓練"] },
  { name: "leadership", keywords: ["團隊管理","決策","激勵","溝通"] },
  { name: "career_planning", keywords: ["履歷","面試","職涯規劃","技能"] },
  { name: "entrepreneurship", keywords: ["創業","商業模式","募資","市場驗證"] },
  { name: "project_management", keywords: ["甘特圖","風險管理","範疇","里程碑"] },
  { name: "ux_hci", keywords: ["使用者研究","介面設計","可用性","原型"] },
  { name: "graphic_design", keywords: ["構圖","色彩學","字體","視覺傳達"] },
  { name: "photography", keywords: ["曝光","構圖","鏡頭","後製"] },
  { name: "film_studies", keywords: ["剪輯","敘事","鏡頭語言","導演"] },
  { name: "music_theory", keywords: ["和弦","旋律","節奏","調性"] },
  { name: "music_practice", keywords: ["視唱","練耳","樂器","演奏技巧"] },
  { name: "visual_arts", keywords: ["素描","色彩","油畫","雕塑"] },
  { name: "theater", keywords: ["表演","劇本","舞台","導演"] },
  { name: "dance", keywords: ["編舞","節奏感","肢體訓練","舞台表現"] },
  { name: "calligraphy", keywords: ["筆法","字體","墨法","章法"] },
  { name: "foreign_languages", keywords: ["語言學習","發音","文法","詞彙"] },
  { name: "translation", keywords: ["翻譯技巧","語境","術語","對等"] },
  { name: "test_prep", keywords: ["模擬考","時間管理","答題技巧","審題"] },
  { name: "study_skills", keywords: ["筆記法","記憶術","複習計畫","專注"] },
  { name: "time_management", keywords: ["番茄鐘","優先順序","日程","目標設定"] },
  { name: "mental_health", keywords: ["壓力管理","情緒調節","睡眠","自我照護"] },
  { name: "nutrition", keywords: ["飲食","營養素","熱量","均衡"] },
  { name: "sports_science", keywords: ["訓練計畫","體能","恢復","運動生理"] },
  { name: "first_aid", keywords: ["急救","CPR","止血","創傷處理"] },
  { name: "ethics", keywords: ["道德判斷","倫理困境","職業倫理","規範"] },
  { name: "cryptography", keywords: ["加密演算法","對稱","非對稱","雜湊"] },
  { name: "blockchain", keywords: ["分散式帳本","智能合約","共識機制","代幣"] },
  { name: "cloud_computing", keywords: ["IaaS","PaaS","SaaS","雲端架構"] },
  { name: "devops", keywords: ["CI/CD","自動化","容器","監控"] },
  { name: "mobile_development", keywords: ["Android","iOS","響應式","API"] },
  { name: "web_development", keywords: ["HTML","CSS","JavaScript","前端"] },
  { name: "humanities_interdisciplinary", keywords: ["文化研究","跨領域","比較研究","方法論"] }
];

/* =============================================================
 * expandKnowledgeBase: 產生指定數量的 knowledgeBase 條目並合併
 * - targetObj: 目標物件 (RealAITutor)
 * - total: 要產生的條目數量 (預設 200)
 * ============================================================= */
function expandKnowledgeBase(targetObj, total = 200) {
  if (!Array.isArray(targetObj.knowledgeBase)) targetObj.knowledgeBase = [];

  function makeGenerator(seed) {
    return function(topic) {
      const keywordsLine = seed.keywords.slice(0, 5).join("、");
      return `📘 **【${seed.name} 教學】**\n\n關於 **${topic}**，這屬於 ${seed.name} 範疇。\n\n**核心關鍵字**：${keywordsLine}\n\n**學習建議**：\n1. 釐清題意與已知條件\n2. 選擇合適概念或公式\n3. 逐步演算並檢查單位與合理性\n\n若你提供具體題目，我可以逐步示範解題過程。`;
    };
  }

  const newEntries = [];
  let idx = 0;
  while (newEntries.length < total) {
    const seed = subjectSeeds[idx % subjectSeeds.length];
    const repeatIndex = Math.floor(newEntries.length / subjectSeeds.length) + 1;
    const category = `${seed.name}_${repeatIndex}`;
    const keywords = seed.keywords.map(k => `${k}${repeatIndex}`).slice(0, 6);
    const entry = {
      category,
      keywords,
      generate: makeGenerator(seed)
    };
    newEntries.push(entry);
    idx++;
  }

  targetObj.knowledgeBase = targetObj.knowledgeBase.concat(newEntries);
  return newEntries.length;
}

/* =============================================================
 * 執行擴充（產生 200 筆條目並合併）
 * ============================================================= */
const added = expandKnowledgeBase(RealAITutor, 200);
console.log(`已新增 ${added} 筆 knowledgeBase 條目到 RealAITutor（目前總數：${RealAITutor.knowledgeBase.length}）`);

/* =============================================================
 * 測試範例：呼叫 askGemini
 * ============================================================= */
(async () => {
  const sampleQ = "三角形面積怎麼算？";
  const reply = await RealAITutor.askGemini(sampleQ, "我不確定要用哪個公式");
  console.log("範例回覆：\n", reply);
})();
