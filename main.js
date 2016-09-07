function hasClass(node, clazz) {
    if (!node) {
        return false;
    }
    if (!node.classList) {
        return false;
    }
    for (var i = 0; i < node.classList.length; i++) {
        if (node.classList[i] == clazz) {
            return true;
        }
    }
    return false;
}

function isBudgetBar(div) {
    if (div.tagName != "TR") {
        return;
    }
    return hasClass(div, "monthly") || hasClass(div, "accrued");
}

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

function buildBarHtml(id, right, left, amount, budgetCategory) {
    var tr = document.createElement("tr");
    tr.id = 'supplement-' + id;
    var bar = document.createElement('div');
    bar.classList = ['bar'];
    var span = document.createElement("span");
    span.title = "You could spend an additional $" + amount.toFixed(2) + " and still be on budget for " + budgetCategory;
    span.style.right = right;
    span.style.left = left;
    span.classList = ['bettermint-budget-bar-supplement'];
    bar.innerHTML = bar.innerHTML + span.outerHTML;
    var barTd = document.createElement('td');
    barTd.innerHTML = barTd.innerHTML + bar.outerHTML;
    var simpleTdHtml = document.createElement('td').outerHTML;
    tr.innerHTML = simpleTdHtml + barTd.outerHTML + simpleTdHtml + simpleTdHtml;
    return span;
}

function getBudgetCategory(budgetRowNode) {
    if (!budgetRowNode.childNodes) {
        return null;
    }
    for (var i = 0; i < budgetRowNode.childNodes.length; i++) {
        var child = budgetRowNode.childNodes[i];
        if (child.tagName == 'TH') {
            return child.getElementsByTagName('a')[0].innerHTML;
        }
    }
    return null;
}

function getMoneyBudgeted(budgetRowNode) {
    if (!budgetRowNode.childNodes) {
        return null;
    }
    for (var i = 0; i < budgetRowNode.childNodes.length; i++) {
        var child = budgetRowNode.childNodes[i];
        if (hasClass(child, 'budget')) {
            return Number(child.innerHTML.replace(/[^0-9\.]+/g,""));
        }
    }
    return null;
}

function getMoneySpent(budgetRowNode) {
    if (!budgetRowNode.childNodes) {
        return null;
    }
    for (var i = 0; i < budgetRowNode.childNodes.length; i++) {
        var child = budgetRowNode.childNodes[i];
        if (hasClass(child, 'bar')) {
            var spans = child.getElementsByTagName('span');
            if (!!spans) {
                return Number(spans[0].innerHTML.replace(/[^0-9\.]+/g,""));
            }
        }
    }
    return null;
}

function addBudgetBarSupplement(node) {
    setTimeout(function() {
        var _node = document.getElementById(node.id);
        var spent = getMoneySpent(node);
        var budgeted = getMoneyBudgeted(node);
        var budgetCategory = getBudgetCategory(node);

        if (spent == null || budgeted == null) {
            console.log("Failed to parse money spent for node with ID: " + node.id);
            return;
        }
        var leftPixels = 285 * (spent / budgeted);
        if (285 - leftPixels < 10) {
            return;
        }
        var left = leftPixels + "px";
        var monthLine = document.getElementById('month-line');
        var monthLineLeft = Number(monthLine.style.left.replace('px', ''));
        if (leftPixels > monthLineLeft) {
            return;
        }
        var right = (285 - monthLineLeft) + 'px';
        var amountLeft = ((monthLineLeft / 285) * budgeted) - spent;
        var tr = buildBarHtml(node.id, right, left, amountLeft, budgetCategory);
        var barDiv = _node.getElementsByTagName('div')[0];
        barDiv.innerHTML = barDiv.innerHTML + tr.outerHTML;
        var oldHeight = monthLine.offsetHeight;
        // monthLine.style.height = (oldHeight + 28) + 'px';

    }, 5000);
}

function supplementAdded(nodeId) {
    var supplementNode = document.getElementById('supplement-' + nodeId);
    return Boolean(supplementNode);
}

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
            var node = mutation.addedNodes[i];
            if (!node) {
                continue;
            }
            if (isBetterMintComponent(node)) {
                continue;
            }
            if (isBudgetBar(node)) {
                if (!supplementAdded(node.id)) {
                    console.log("Budget bar");
                    addBudgetBarSupplement(node);
                }
            }
            if (hasClass(node, 'OverviewPageView')) {
                // Add top bar?
                // initializeBetterMint(node);
            }
            if (node.id == 'overview-left-column') {
//                initializeBetterMint(node);
            }
        }
        return true;
    });
});
observer.observe(document, { childList: true, subtree: true });