/* =========================================================
 *  Paper Generator v2 SAFE
 *  Compatible with AutoTemplateFissionFactory v2
 * ========================================================= */

(function () {
  'use strict';

  const log = (...args) => console.log("📄 [PaperGen]", ...args);

  function waitForFactory(cb) {
    if (!window.AutoTemplateFissionFactory?.ready) {
      setTimeout(() => waitForFactory(cb), 50);
      return;
    }
    cb();
  }

  function safeGenerate(subject, grade) {
    const Factory = window.AutoTemplateFissionFactory;
    const T = Factory.templates;

    // ❌ 找不到科目 / 年級
    if (!T?.[subject]?.[grade]) {
      return errorQuestion(
        `❌ 找不到題庫`,
        `${subject} / ${grade}`,
        `templates[${subject}][${grade}] 不存在`
      );
    }

    const pool = T[subject][grade];

    // ❌ pool 為空
    if (!Array.isArray(pool) || pool.length === 0) {
      return errorQuestion(
        `⚠️ 題庫為空`,
        `${subject} / ${grade}`,
        `pool.length === 0`
      );
    }

    const fn = pool[Math.floor(Math.random() * pool.length)];

    // ❌ 不是函式
    if (typeof fn !== "function") {
      return errorQuestion(
        `⚠️ 模板格式錯誤`,
        `${subject} / ${grade}`,
        `typeof template !== function`
      );
    }

    let q;
    try {
      q = fn();
    } catch (e) {
      return errorQuestion(
        `💥 模板執行錯誤`,
        `${subject} / ${grade}`,
        e.message
      );
    }

    // ❌ 回傳 null
    if (!q) {
      return errorQuestion(
        `⚠️ 模板回傳 null`,
        `${subject} / ${grade}`,
        `資料不足或過濾條件過嚴`
      );
    }

    // ✅ 成功
    q.__debug = {
      subject,
      grade,
      template: fn.name || "anonymous"
    };

    return q;
  }

  function errorQuestion(title, location, detail) {
    return {
      question: title,
      options: [
        `📍 ${location}`,
        `🧪 ${detail}`
      ],
      answer: 0,
      explanation: [],
      __error: true
    };
  }

  // ===============================
  // 對外 API（給 exam.html 用）
  // ===============================
  window.PaperGeneratorV2 = {
    generate(subject, grade) {
      return safeGenerate(subject, grade);
    }
  };

  // ===============================
  // Debug 面板（右下角）
  // ===============================
  function mountDebugPanel() {
    const el = document.createElement("div");
    el.style.cssText = `
      position: fixed;
      bottom: 8px;
      right: 8px;
      background: rgba(0,0,0,.75);
      color: #0f0;
      font-size: 12px;
      padding: 6px 8px;
      z-index: 9999;
      font-family: monospace;
    `;
    el.innerText = "PaperGen v2 SAFE";

    document.body.appendChild(el);

    document.addEventListener("paper:rendered", e => {
      const d = e.detail?.__debug;
      if (!d) return;
      el.innerText = `📄 ${d.subject}｜${d.grade}\n🧩 ${d.template}`;
    });
  }

  waitForFactory(() => {
    log("🔥 PAPER GEN v2 SAFE 已啟動");
    mountDebugPanel();
    document.dispatchEvent(new Event("PaperGeneratorReady"));
  });

})();
