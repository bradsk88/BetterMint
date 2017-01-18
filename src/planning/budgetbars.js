function PlanningBudgetBars() {
    var self = this;
    self.nodes = [];
    self.consider = function(node) {
        if (!!node.parentElement && node.parentElement.id == 'spendingBudget-list-body') {
            self.nodes.push(node);
        }
    };
    self.batchAddComponents = function() {
        for (var i = 0; i < self.nodes.length; i++) {
            self.nodes[i].style.background = "blue";
        }
    };
}