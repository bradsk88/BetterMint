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


var observer = new MutationObserver(function(mutations) {
    var overviewBudgetBars = new OverviewBudgetBars();
    mutations.forEach(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
            var node = mutation.addedNodes[i];
            if (!node) {
                continue;
            }
            if (!!node.parentElement && node.parentElement.id == 'spendingBudget-list-body') {
                node.style.background = 'red';
            }
            if (isBetterMintComponent(node)) {
                continue;
            }
            overviewBudgetBars.consider(node);
            
            if (hasClass(node, 'OverviewPageView')) {
                // Add top bar?
                // initializeBetterMint(node);
            }
            if (node.id == 'overview-left-column') {
//                initializeBetterMint(node);
            }
        }
        overviewBudgetBars.batchAddComponents();
        return true;
    });
});
observer.observe(document, { childList: true, subtree: true });