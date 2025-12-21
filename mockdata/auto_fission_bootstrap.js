// mockdata/auto_fission_bootstrap.js
(function () {
    console.log("⏳ [Bootstrap] 等待 AutoTemplateFissionFactory...");

    function onReady() {
        console.log("🚀 [Bootstrap] Factory Ready，系統完成啟動");
        window.AutoTemplateFissionBootstrapped = true;
    }

    // 已經 ready（防止 script 順序不同）
    if (
        window.AutoTemplateFissionFactory &&
        window.AutoTemplateFissionFactory.ready
    ) {
        onReady();
    } else {
        window.addEventListener(
            "AutoTemplateFissionFactoryReady",
            onReady,
            { once: true }
        );
    }
})();
