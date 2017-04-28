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

var overviewBudgetBars = new OverviewBudgetBars();
var planningBudgetBars = new PlanningBudgetBars();
var overviewBalanceColors = new OverviewBalanceColors();

var strategies = [
    OverviewBudgetBars,
    PlanningBudgetBars,
    OverviewBalanceColors
];

var observer = new MutationObserver(function(mutations) {

	var activeStrategies = [];
	for (var s = 0; s < strategies.length; s++) {
	   	var strategy = new strategies[s]();
	    strategy.init()
	    if (strategy.isActive()) {
			activeStrategies.push(strategy);
	    }
	}
    mutations.forEach(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
            var node = mutation.addedNodes[i];
            if (!node) {
                continue;
            }
            if (isBetterMintComponent(node)) {
                continue;
            }
			for (var s = 0; s < activeStrategies.length; s++) {
				//console.log("Considering node for " + activeStrategies[s].constructor.name);
				activeStrategies[s].consider(node);			
			}
            // overviewBudgetBars.consider(node);
            // planningBudgetBars.consider(node);
        }
		for (var s = 0; s < activeStrategies.length; s++) {
			//console.log("Running batch add for " + activeStrategies[s].constructor.name);
			activeStrategies[s].batchAddComponents();
		}
        // overviewBudgetBars.batchAddComponents();
        // planningBudgetBars.batchAddComponents();
        return true;
    });
});
observer.observe(document, { childList: true, subtree: true });
