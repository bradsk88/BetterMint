const PREFIX = 'planning-supplement-';

function PlanningBudgetBars() {
    var self = this;
    self.nodes = [];
    self.consider = function (node) {
        if (!!node.parentElement && node.parentElement.id === 'spendingBudget-list-body') {
            self.nodes.push(node);
        }
    };
    self.doAddBudgetBarSupplement = function (node) {
        const _id = node.id;
        const text = node.getElementsByClassName('progress')[0].innerText;
        const spent = getDollarsIntFromText(text.split(' of ')[0]);
        const allotted = getDollarsIntFromText(text.split(' of ')[1]);
        if (allotted === 0) {
            return;
        }
        node = node.getElementsByClassName('status')[0];
        let title = node.title;
        node.removeAttribute('title');
        node.getElementsByClassName('progress_bar')[0].title = title;
        const newBar = document.createElement('span');
        newBar.id = PREFIX + _id;
        newBar.classList = 'progress_bar bettermint_planning_supplement_bar';
        const maxWidth = 512;
        const fraction = spent / allotted;
        const left = (maxWidth * fraction);
        if (left > 511) {
            return;
        }
        let styleLeft = left;
        if (left <= 0) {
            styleLeft = 0;
            newBar.classList = newBar.classList + ' left';
        }
        newBar.style.left = styleLeft + 'px';
        let width = (maxWidth * getTodayAsFractionOfMonth()) - styleLeft;
        if (width < 0) { // Overspent
            return;
        }
        newBar.style.width = width + 'px';
        const remainder = (getTodayAsFractionOfMonth() * allotted) - spent;
        const remCash = '$' + Number(Math.floor(remainder * 100) / 100).toFixed(2);
        newBar.title = "You could spend " + remCash + " and still be on track.";
        newBar.innerText = remCash;
        node.append(newBar);
    };
    self.supplementAdded = function (nodeId) {
        const supplementNode = document.getElementById(PREFIX + nodeId);
        return Boolean(supplementNode);
    };
    self.batchAddComponents = function () {
        for (let i = 0; i < self.nodes.length; i++) {
            const node = self.nodes[i];
            setTimeout(function () {
                if (!self.supplementAdded(node.id)) {
                    self.doAddBudgetBarSupplement(node);
                }
            }, 1);
        }
    };
}
