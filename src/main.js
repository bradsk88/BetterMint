function isBetterMintComponent(node) {
    return hasClass(node, 'bettermint-budget-bar-supplement');
}

function initializeBetterMint(leftColumnNode) {
    setTimeout(function() {
        var badge = document.createElement("div");
        badge.classList = ['bm-header-badge'];
        badge.innerHTML = "BetterMint Extension is Active";
        leftColumnNode.innerHTML = badge.outerHTML + leftColumnNode.innerHTML
    }, 2000);
}

let tipPercent = 0;
chrome.storage.sync.get('tipPercent', (settings) => {
    if (settings['tipPercent'] !== "") {
        tipPercent = Number.parseInt(settings['tipPercent']);
    }
});

var observer = new MutationObserver(function(mutations) {
    var overviewBudgetBars = new OverviewBudgetBars();
    var planningBudgetBars = new PlanningBudgetBars();
    var autoSplitButton = new AutoSplitButton(settings);
    mutations.forEach(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
            var node = mutation.addedNodes[i];
            if (!node) {
                continue;
            }
            if (isBetterMintComponent(node)) {
                continue;
            }
            overviewBudgetBars.consider(node);
            planningBudgetBars.consider(node);
			autoSplitButton.consider(node);
            
            if (hasClass(node, 'OverviewPageView')) {
                // Add top bar?
                // initializeBetterMint(node);
            }
            if (node.id == 'overview-left-column') {
//                initializeBetterMint(node);
            }
        }
        overviewBudgetBars.batchAddComponents();
        planningBudgetBars.batchAddComponents();
		autoSplitButton.batchAddComponents();
        return true;
    });
});
observer.observe(document, { childList: true, subtree: true });
