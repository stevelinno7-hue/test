(function (global) {
  'use strict';

  const debugLog = [];

  function normalizeQuestion(q, meta) {
    if (!q) {
      debugLog.push({ ...meta, status: "NULL_RETURN" });
      return null;
    }

    if (
      typeof q.question === "string" &&
      Array.isArray(q.options) &&
      typeof q.answer === "number"
    ) {
      debugLog.push({ ...meta, status: "OK" });
      return {
        id: meta.index,
        question: q.question,
        options: q.options,
        answer: q.answer,
        concept: q.concept || "",
        explanation: q.explanation || [],
        __meta: meta
      };
    }

    debugLog.push({ ...meta, status: "INVALID_FORMAT", payload: q });
    return null;
  }

  function generatePaper({ templates, count }) {
    const paper = [];
    const used = new Set();

    templates.forEach((tpl, i) => {
      if (paper.length >= count) return;

      let raw;
      try {
        raw = tpl.fn();
      } catch (e) {
        debugLog.push({
          index: i + 1,
          template: tpl.name,
          tags: tpl.tags,
          status: "EXCEPTION",
          error: e.message
        });
        return;
      }

      const q = normalizeQuestion(raw, {
        index: paper.length + 1,
        template: tpl.name,
        tags: tpl.tags
      });

      if (!q) return;

      if (used.has(q.question)) {
        debugLog.push({
          ...q.__meta,
          status: "DUPLICATE"
        });
        return;
      }

      used.add(q.question);
      paper.push(q);
    });

    return paper;
  }

  global.PaperGenerator = {
    generatePaper,
    getDebugLog: () => debugLog
  };

  document.dispatchEvent(new Event("PaperGeneratorReady"));
  console.log("🔥 PaperGenerator READY (debug + compatible)");
})(window);
