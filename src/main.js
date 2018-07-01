
function isBetterMintComponent(node) {
    return hasClass(node, 'bettermint-budget-bar-supplement');
}

// function initializeBetterMint(leftColumnNode) {
//     setTimeout(function() {
//         var badge = document.createElement("div");
//         badge.classList.add('bm-header-badge');
//         badge.innerHTML = "BetterMint Extension is Active";
//         leftColumnNode.innerHTML = badge.outerHTML + leftColumnNode.innerHTML
//     }, 2000);
// }


const observer = new MutationObserver(function (mutations) {
    const overviewBudgetBars = new OverviewBudgetBars();
    const planningBudgetBars = new PlanningBudgetBars();
    const futurePlanningEditor = new FuturePlanningEditor();

    mutations.forEach(function (mutation) {
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
            futurePlanningEditor.consider(node);


            if (hasClass(node, 'OverviewPageView')) {
                // Add top bar?
                // initializeBetterMint(node);
            }
            if (node.id === 'overview-left-column') {
//                initializeBetterMint(node);
            }
        }
        overviewBudgetBars.batchAddComponents();
        planningBudgetBars.batchAddComponents();
        futurePlanningEditor.batchAddComponents();
        return true;
    });
});
observer.observe(document, { childList: true, subtree: true });

function loadCategories() {
    let url = 'https://mint.intuit.com/app/getJsonData.xevent?task=categories&rnd=' + new Date().getTime();
    // url = 'https://mint.intuit.com/bundledServiceController.xevent?legacy=false&token=';
    fetch(url)
        .then(data => data.text())
        .then(text => console.log(text))
        .catch(e => console.log(e));
}

loadCategories();