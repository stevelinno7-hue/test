// ===============================
// 📄 Paper Generator v2025-SAFE
// ===============================

(function (global) {
  'use strict';

  console.log("📄 [PaperGen] 🔥 PAPER GEN VERSION 2025-SAFE loaded");

  // -------------------------------
  // 等 Factory Ready
  // -------------------------------
  function waitFactory(cb) {
    if (
      global.AutoTemplateFissionFactory &&
      global.AutoTemplateFissionFactory.ready
    ) {
      cb();
    } else {
      setTimeout(() => waitFactory(cb), 50);
    }
  }

  // -------------------------------
  // 題目正規化（唯一標準）
  // -------------------------------
  function normalizeQuestion(raw, meta = {}) {
    if (!raw || typeof raw !== "object") return null;

    // ✅ 新格式（你現在全部科目用的）
    if (
      typeof raw.question === "string" &&
      Array.isArray(raw.options) &&
      typeof raw.answer === "number"
    ) {
      return {
        question: raw.question,
        options: raw.options,
        answer: raw.answer,
        explanation: raw.explanation || [],
        concept: raw.concept,
        meta
      };
    }

    return null;
  }

  // -------------------------------
  // 安全取題（不炸）
  // -------------------------------
  function safeGenerate(subject, grade) {
    const Factory = global.AutoTemplateFissionFactory;
    const T = Factory.templates;

    if (!T?.[subject]?.[grade]) {
      return {
        question: `❌ 找不到題庫：${subject} ${grade}`,
        options: ["請檢查模板是否有註冊"],
        answer: 0,
        explanation: []
      };
    }

    const pool = T[subject][grade];
    if (!Array.isArray(pool) || pool.length === 0) {
      return {
        question: `⚠️ 題庫為空：${subject} ${grade}`,
        options: ["沒有可用模板"],
        answer: 0,
        explanation: []
      };
    }

    const fn = pool[Math.floor(Math.random() * pool.length)];
    let q = null;

    try {
      q = fn();
    } catch (e) {
      return {
        question: `💥 模板執行錯誤：${subject} ${grade}`,
        options: [String(e)],
        answer: 0,
        explanation: []
      };
    }

    if (!q) {
      return {
        question: `⚠️ 模板回傳 null：${subject} ${grade}`,
        options: ["資料不足或過濾條件過嚴"],
        answer: 0,
        explanation: []
      };
    }

    return q;
  }

  // -------------------------------
  // 📘 產生試卷（主 API）
  // -------------------------------
  function generatePaper({
    subject,
    grade,
    count = 5
  }) {
    const paper = [];
    let guard = 0;

    while (paper.length < count && guard++ < count * 5) {
      const raw = safeGenerate(subject, grade);
      const q = normalizeQuestion(raw, {
        subject,
        grade
      });

      if (q) {
        paper.push(q);
      } else {
        paper.push({
          question: `❌ 題目格式錯誤：${subject} ${grade}`,
          options: ["請檢查模板回傳格式"],
          answer: 0,
          explanation: []
        });
      }
    }

    return paper;
  }

  // -------------------------------
  // 對外掛 API
  // -------------------------------
  waitFactory(() => {
    global.PaperGenerator = {
      generatePaper
    };

    console.log("🚦 PaperGeneratorReady dispatched");
    document.dispatchEvent(new Event("PaperGeneratorReady"));
  });

})(window);
