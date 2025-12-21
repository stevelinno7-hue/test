(function (window) {
  'use strict';

  /* ================================
   * 年級 alias 定義
   * ================================ */
  const GRADE_ALIAS = {
    "國七上": "國七", "國七下": "國七",
    "國八上": "國八", "國八下": "國八",
    "國九上": "國九", "國九下": "國九",
    "高一上": "高一", "高一下": "高一",
    "高二上": "高二", "高二下": "高二",
    "高三上": "高三", "高三下": "高三"
  };

  const CORE_GRADES = ["國七", "國八", "國九", "高一", "高二", "高三"];

  function normalizeTags(tags = []) {
    return tags.map(t => GRADE_ALIAS[t] || t);
  }

  const G = window.RigorousGenerator || window.global?.RigorousGenerator;
  if (!G) return;

  /* ================================
   * 主入口
   * ================================ */
  window.generatePaper = function (config) {
    const {
      subject,
      total = 10,
      tags: rawTags = []
    } = config;

    const tags = normalizeTags(rawTags);

    console.log(
      `[PaperGen] 收到組卷請求`,
      { subject, rawTags, normalizedTags: tags }
    );

    const allTemplates = Object.values(G.templates);

    /* ================================
     * 1. 科目過濾
     * ================================ */
    const prefixMap = {
      math: 'math',
      physics: 'phy',
      chemistry: 'chm',
      biology: 'bio',
      english: 'eng',
      chinese: 'chi',
      history: 'his',
      geography: 'geo',
      civics: 'civ',
      earth: 'ear',
      earth_science: 'ear'
    };

    const subjectKey = prefixMap[subject] || subject;

    let pool = allTemplates.filter(t => {
      if (!t.tags) return false;

      const idMatch = t.id.toLowerCase().includes(subjectKey);

      const tagMatch = t.tags.some(tag =>
        tag === subject ||
        tag === subjectKey ||
        (subject === 'english' && tag === '英文') ||
        (subject === 'math' && tag === '數學') ||
        (subject === 'chinese' && tag === '國文') ||
        (subject === 'physics' && tag === '物理') ||
        (subject === 'chemistry' && tag === '化學') ||
        (subject === 'biology' && tag === '生物') ||
        (subject === 'history' && tag === '歷史') ||
        (subject === 'geography' && tag === '地理') ||
        (subject === 'civics' && tag === '公民')
      );

      return idMatch || tagMatch;
    });

    /* ================================
     * 2. 年級鎖定（核心）
     * ================================ */
    const targetGrade = tags.find(t => CORE_GRADES.includes(t));
    let coreGrade = null;

    if (targetGrade) {
      coreGrade = targetGrade;
      console.log(`🔒 年級鎖定：${coreGrade}`);

      pool = pool.filter(t =>
        Array.isArray(t.tags) && t.tags.includes(coreGrade)
      );
    } else {
      console.warn("⚠️ 未指定年級，可能跨年級出題");
    }

    if (pool.length === 0) {
      console.warn(
        `[PaperGen] 找不到題目`,
        { subject, coreGrade, tags }
      );
      return fallback(total, `題庫建置中 (${subject} ${coreGrade || ''})`);
    }

    /* ================================
     * 3. 單元過濾（非年級、非科目）
     * ================================ */
    const unitTags = tags.filter(t =>
      !CORE_GRADES.includes(t) &&
      t !== subject &&
      t !== subjectKey &&
      !['數學', '國文', '英文', '自然', '社會', '會考核心', '學測核心', '模考'].includes(t)
    );

    if (unitTags.length > 0) {
      const strictPool = pool.filter(t =>
        unitTags.some(ut => t.tags.some(tt => tt.includes(ut)))
      );
      if (strictPool.length > 0) pool = strictPool;
    }

    /* ================================
     * 4. 選題
     * ================================ */
    const questions = [];
    let safety = 0;

    while (questions.length < total && safety < 200) {
      addRandom(pool, questions);
      safety++;
    }

    return G.utils.shuffle(questions).map((q, i) => ({
      ...q,
      id: i + 1
    }));
  };

  /* ================================
   * 工具函式
   * ================================ */
  function addRandom(pool, list) {
    if (!pool.length) return;
    const tmpl = pool[Math.floor(Math.random() * pool.length)];
    try {
      const q = tmpl.func({}, Math.random);
      q.templateId = tmpl.id;
      list.push(q);
    } catch (e) {}
  }

  function fallback(count, msg) {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      question: msg,
      options: ["A", "B", "C", "D"],
      answer: 0,
      concept: "系統提示"
    }));
  }

})();
