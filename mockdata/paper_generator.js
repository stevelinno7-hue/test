(function () {
  'use strict';

  console.log('🔥 PAPER GEN VERSION 2025-01-SAFE-FINAL');

  /* ================================
   * 基本設定
   * ================================ */

  const G = window.RigorousGenerator;
  if (!G || !G.templates) {
    console.error('❌ RigorousGenerator or templates not ready');
    return;
  }

  const CORE_GRADES = ['國七', '國八', '國九', '高一', '高二', '高三'];

  const SUBJECT_MAP = {
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

  /* ================================
   * 工具：tag 正規化（系統級）
   * ================================ */
  function normalizeTags(tags = []) {
    const out = new Set();

    tags.forEach(t => {
      if (typeof t !== 'string') return;

      if (t.startsWith('國七')) out.add('國七');
      else if (t.startsWith('國八')) out.add('國八');
      else if (t.startsWith('國九')) out.add('國九');
      else if (t.startsWith('高一')) out.add('高一');
      else if (t.startsWith('高二')) out.add('高二');
      else if (t.startsWith('高三')) out.add('高三');
      else out.add(t);
    });

    return Array.from(out);
  }

  /* ================================
   * fallback（保命）
   * ================================ */
  function fallback(total, msg) {
    return Array.from({ length: total }, (_, i) => ({
      id: i + 1,
      question: msg,
      options: ['A', 'B', 'C', 'D'],
      answer: 0,
      concept: '系統提示',
      templateId: 'fallback'
    }));
  }

  /* ================================
   * 主函式（exam.html 唯一入口）
   * ================================ */
  window.generatePaper = function ({ subject, total = 10, tags = [] }) {

    const normTags = normalizeTags(tags);

    console.log('📥 generatePaper()', {
      subject,
      total,
      tags: normTags
    });

    const subjectKeys = SUBJECT_MAP[subject] || [subject];
    const templates = Object.values(G.templates);

    /* ================================
     * 1️⃣ 科目過濾
     * ================================ */
    let pool = templates.filter(t =>
      t &&
      typeof t.func === 'function' &&
      (
        t.tags?.some(tag => subjectKeys.includes(tag)) ||
        subjectKeys.some(k => String(t.id).includes(k))
      )
    );

    /* ================================
     * 2️⃣ 年級鎖定
     * ================================ */
    const grade = normTags.find(t => CORE_GRADES.includes(t));
    if (grade) {
      pool = pool.filter(t => t.tags?.includes(grade));
    }

    if (!pool.length) {
      console.warn('⚠️ 題庫為空，直接 fallback');
      return fallback(total, `題庫建置中（${subject}）`);
    }

    /* ================================
     * 3️⃣ 出題核心
     * ================================ */
    const ctx = Object.freeze({
      subject,
      tags: normTags
    });

    const result = [];
    const used = new Set();
    const templateCount = {};

    const MAX_PER_TEMPLATE = 2;
    const COOLDOWN_RATE = 0.25;

    let guard = 0;

    while (result.length < total && guard++ < 500) {

      const available = pool.filter(t => {
        const count = templateCount[t.id] || 0;
        return count < MAX_PER_TEMPLATE || Math.random() < COOLDOWN_RATE;
      });

      if (!available.length) break;

      const tmpl = available[Math.floor(Math.random() * available.length)];
      let q;

      try {
        q = tmpl.func(ctx, Math.random);
      } catch (e) {
        console.warn(`⚠️ template ${tmpl.id} throw error`, e);
        continue;
      }

      if (!q) continue;

      if (
        typeof q.question !== 'string' ||
        !Array.isArray(q.options) ||
        typeof q.answer !== 'number'
      ) {
        console.warn(`⚠️ template ${tmpl.id} 回傳格式錯誤`);
        continue;
      }

      const key = `${tmpl.id}::${q.question}`;
      if (used.has(key)) continue;

      used.add(key);
      templateCount[tmpl.id] = (templateCount[tmpl.id] || 0) + 1;

      result.push({
        id: result.length + 1,
        question: q.question,
        options: q.options,
        answer: q.answer,
        concept: q.concept || '綜合題型',
        templateId: tmpl.id
      });
    }

    /* ================================
     * 4️⃣ 不足補 fallback（重要）
     * ================================ */
    if (result.length < total) {
      console.warn(`⚠️ 題目不足 ${result.length}/${total}，補 fallback`);
      const fill = fallback(total - result.length, `題庫補題中（${subject}）`);
      fill.forEach(q => {
        q.id = result.length + 1;
        result.push(q);
      });
    }

    return result;
  };

})();
