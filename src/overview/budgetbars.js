function OverviewBudgetBars() {
    var self = this;
    self.nodes = [];
    self.needsPurge = false;

    self.buildBarHtml = function (id, right, left, amount, budgetCategory) {
        // var tr = document.createElement("tr");
        // tr.id = 'supplement-' + id;
        var bar = document.createElement('div');
        bar.classList = ['bar'];
        var span = document.createElement("span");
        span.id = 'supplement-' + id;
        var category = budgetCategory.replace('&amp;', '&');
        span.title = "You could spend an additional $" + amount.toFixed(2) + " and still be on budget for " + category;
        span.style.right = right;
        span.style.left = left;
        span.classList = ['bettermint-budget-bar-supplement'];
        bar.innerHTML = bar.innerHTML + span.outerHTML;
        var barTd = document.createElement('td');
        barTd.innerHTML = barTd.innerHTML + bar.outerHTML;
        var simpleTdHtml = document.createElement('td').outerHTML;
        // tr.innerHTML = simpleTdHtml + barTd.outerHTML + simpleTdHtml + simpleTdHtml;
        return span;
    };

    self.getBudgetCategory = function (budgetRowNode) {
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
    };

    self.getMoneyBudgeted = function (budgetRowNode) {
        if (!budgetRowNode.childNodes) {
            return null;
        }
        for (var i = 0; i < budgetRowNode.childNodes.length; i++) {
            var child = budgetRowNode.childNodes[i];
            if (hasClass(child, 'budget')) {
                return Number(child.innerHTML.replace(/[^0-9\.]+/g, ""));
            }
        }
        return null;
    };

    self.getMoneySpent = function (budgetRowNode) {
        if (!budgetRowNode.childNodes) {
            return null;
        }
        for (var i = 0; i < budgetRowNode.childNodes.length; i++) {
            var child = budgetRowNode.childNodes[i];
            if (hasClass(child, 'bar')) {
                var spans = child.getElementsByTagName('span');
                if (!!spans) {
                    return Number(spans[0].innerHTML.replace('–', '-').replace(/[^0-9^\-\.]+/g, ""));
                }
            }
        }
        return null;
    };

    self.addBudgetBarSupplement = function (node) {
        setTimeout(function () {
            if (!self.supplementAdded(node.id)) {
                self.doAddBudgetBarSupplement(node);
            }
        }, 1);
    };

    self.doAddBudgetBarSupplement = function (node) {
        var _node = document.getElementById(node.id);
        var spent = self.getMoneySpent(node);
        var budgeted = self.getMoneyBudgeted(node);
        var budgetCategory = self.getBudgetCategory(node);

        if (spent == null || budgeted == null) {
            console.log("Failed to parse money spent for node with ID: " + node.id);
            return;
        }
        var leftPixels = 285 * (spent / budgeted);
        if (285 - leftPixels < 10) {
            return;
        }
        if (leftPixels < 0) {
            leftPixels = 0;
        }
        var left = leftPixels + "px";
        var monthLine = document.getElementById('month-line');
        var monthLineLeft = Number(monthLine.style.left.replace('px', ''));
        if (leftPixels > monthLineLeft) {
            return;
        }
        var right = (285 - monthLineLeft) + 'px';
        var amountLeft = ((monthLineLeft / 285) * budgeted) - spent;
        var tr = self.buildBarHtml(node.id, right, left, amountLeft, budgetCategory);
        var barDiv = _node.getElementsByTagName('div')[0];
        barDiv.innerHTML = barDiv.innerHTML + tr.outerHTML;
        var oldHeight = monthLine.offsetHeight;
        // monthLine.style.height = (oldHeight + 28) + 'px';
    };

    self.supplementAdded = function (nodeId) {
        var supplementNode = document.getElementById('supplement-' + nodeId);
        return Boolean(supplementNode);
    };

    self.isBudgetBar = function(div) {
        if (div.tagName != "TR") {
            return;
        }
        return hasClass(div, "monthly") || hasClass(div, "accrued");
    };

    self.consider = function(node) {
        if (self.isBudgetBar(node)) {
            self.nodes.push(node);
            self.needsPurge = true;
        }
    };

    self.batchAddComponents = function() {
        if (self.needsPurge) {
            removeElementsByClass('bettermint-budget-bar-supplement');
            self.needsPurge = false;
        }
        var i;
        for (i = 0; i < self.nodes.length; i++) {
            self.addBudgetBarSupplement(self.nodes[i]);
        }
    };
}


