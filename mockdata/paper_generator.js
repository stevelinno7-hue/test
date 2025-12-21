(function (global) {
  'use strict';

  function normalizeQuestion(q, id) {
    if (!q) return null;

    // 已是標準格式
    if (
      typeof q.question === "string" &&
      Array.isArray(q.options) &&
      typeof q.answer === "number"
    ) {
      return {
        id,
        question: q.question,
        options: q.options,
        answer: q.answer,
        concept: q.concept || "",
        explanation: q.explanation || []
      };
    }

    // ❌ 其他未知格式 → 丟棄
    console.warn("⚠️ 無法辨識的題目格式", q);
    return null;
  }

  function generatePaper({ templates, count }) {
    const G = global.RigorousGenerator;
    if (!G || !G.isReady || !G.isReady()) {
      throw new Error("❌ Generator 尚未就緒");
    }

    const paper = [];
    const usedStem = new Set();

    for (let tpl of templates) {
      if (paper.length >= count) break;

      let raw;
      try {
        raw = tpl();
      } catch (e) {
        console.warn("❌ 模板執行失敗", e);
        continue;
      }

      const q = normalizeQuestion(raw, paper.length + 1);
      if (!q) continue;

      const stem = q.question.trim();
      if (usedStem.has(stem)) continue;

      usedStem.add(stem);
      paper.push(q);
    }

    return paper;
  }

  global.PaperGenerator = { generatePaper };

  document.dispatchEvent(new Event("PaperGeneratorReady"));
  console.log("🔥 PaperGenerator READY (backward compatible)");
})(window);
