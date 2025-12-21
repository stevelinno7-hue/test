(function (window) {
  'use strict';

  console.log("🔥 FINAL PaperGen LOADED");

  /* ================================
   * 年級 alias
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

  const normalizeTags = (tags = []) =>
    tags.map(t => GRADE_ALIAS[t] || t);

  const G = window.RigorousGenerator || window.global?.RigorousGenerator;
  if (!G) {
    console.error("❌ RigorousGenerator not found");
    return;
  }

  /* ================================
   * 主入口
   * ================================ */
  window.generatePaper = function ({ subject, total = 10, tags = [] }) {
    const normTags = normalizeTags(tags);

    console.log("📥 PaperGen Request", {
      subject,
      rawTags: tags,
      normalizedTags: normTags
    });

    const allTemplates = Object.values(G.templates);

    /* ================================
     * 1️⃣ 科目過濾
     * ================================ */
    const subjectMap = {
      math: ['math', '數學'],
      english: ['eng', '英文'],
      chinese: ['chi', '國文'],
      physics: ['phy', '物理'],
      chemistry: ['chm', '化學'],
      biology: ['bio', '生物'],
      history: ['his', '歷史'],
      geography: ['geo', '地理'],
      civics: ['civ', '公民'],
      earth: ['ear', '地科']
    };

    const subjectKeys = subjectMap[subject] || [subject];

    let pool = allTemplates.filter(t =>
      t.tags?.some(tag => subjectKeys.includes(tag)) ||
      subjectKeys.some(k => t.id.includes(k))
    );

    /* ================================
     * 2️⃣ 年級鎖定（語意式）
     * ================================ */
    const coreGrade = normTags.find(t => CORE_GRADES.includes(t));

    if (coreGrade) {
      console.log(`🔒 年級鎖定：${coreGrade}`);

      pool = pool.filter(t =>
        t.tags?.some(tag => tag.includes(coreGrade))
      );
    } else {
      console.warn("⚠️ 未指定年級");
    }

    if (!pool.length) {
      console.warn("❌ 題庫為空", { subject, coreGrade, tags: normTags });
      return fallback(total, `題庫建置中（${subject} ${coreGrade || ''}）`);
    }

    /* ================================
     * 3️⃣ 單元過濾（可選）
     * ================================ */
    const unitTags = normTags.filter(t =>
      !CORE_GRADES.includes(t) &&
      !subjectKeys.includes(t) &&
      !['會考核心', '學測核心', '模考', '核心'].includes(t)
    );

    if (unitTags.length) {
      const strict = pool.filter(t =>
        unitTags.some(u => t.tags?.some(tt => tt.includes(u)))
      );
      if (strict.length) pool = strict;
    }

    /* ================================
     * 4️⃣ 出題
     * ================================ */
    const result = [];
    let guard = 0;

    while (result.length < total && guard++ < 200) {
      const tmpl = pool[Math.floor(Math.random() * pool.length)];
      try {
        const q = tmpl.func({}, Math.random);
        result.push({ ...q, templateId: tmpl.id });
      } catch {}
    }

    return G.utils.shuffle(result).map((q, i) => ({
      ...q,
      id: i + 1
    }));
  };

  /* ================================
   * fallback
   * ================================ */
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
