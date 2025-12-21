window.addEventListener('load', function () {
  'use strict';

  console.log("⏳ [Bootstrap] 等待頁面載入完成，準備啟動...");

  const G = window.RigorousGenerator;

  function startBootstrap(G) {
    if (!G || !G.registerTemplate) {
      console.error("❌ [Bootstrap] RigorousGenerator 不存在");
      return;
    }

    // 只攔一次（防止重複 bootstrap）
    if (G.__fissionHooked) {
      console.warn("⚠️ [Bootstrap] 已經啟動過，略過");
      return;
    }
    G.__fissionHooked = true;

    if (!G._rawRegister) {
      G._rawRegister = G.registerTemplate;
    }

    // 攔截 registerTemplate
    G.registerTemplate = function (name, func, tags = []) {
      try {
        if (typeof G.autoFissionRegister === 'function') {
          G.autoFissionRegister(name, func, tags, G._rawRegister);
        } else {
          G._rawRegister.call(G, name, func, tags);
        }
      } catch (e) {
        console.error("❌ [Bootstrap] 裂變失敗，回退原始註冊", e);
        G._rawRegister.call(G, name, func, tags);
      }
    };

    console.log("🚀 [Bootstrap] 攔截器啟動成功！");
  }

  // 等待工廠出現（最多 1 秒）
  let retry = 0;
  const timer = setInterval(() => {
    if (G && G.autoFissionRegister) {
      clearInterval(timer);
      startBootstrap(G);
    } else if (++retry > 20) {
      clearInterval(timer);
      console.error("❌ [Bootstrap] 等待 AutoTemplateFissionFactory 逾時");
    }
  }, 50);
});
