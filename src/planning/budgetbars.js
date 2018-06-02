const PREFIX = 'planning-supplement-';

function PlanningBudgetBars() {
    let self = this;
    self.nodes = [];
    self.consider = function (node) {
        if (!!node.parentElement && node.parentElement.id == 'spendingBudget-list-body') {
            self.nodes.push(node);
        }
    };
    self.doAddBudgetBarSupplement = function (node) {
        let _id = node.id;
        let text = node.getElementsByClassName('progress')[0].innerText;
        let spent = getDollarsIntFromText(text.split(' of ')[0]);
        let allotted = getDollarsIntFromText(text.split(' of ')[1]);
        if (allotted === 0) {
            return;
        }
        node = node.getElementsByClassName('status')[0];
        let title = node.title;
        node.removeAttribute('title');
        node.getElementsByClassName('progress_bar')[0].title = title;

        let newBar = document.createElement('span');
        newBar.id = PREFIX + _id;
        newBar.classList = 'progress_bar bettermint_planning_supplement_bar';
        let maxWidth = 512;
        let fraction = spent / allotted;
        let left = (maxWidth * fraction);
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
        let remainder = (getTodayAsFractionOfMonth() * allotted) - spent;
        let remCash = '$' + Number(Math.floor(remainder * 100) / 100).toFixed(2);
        newBar.title = "You could spend " + remCash + " and still be on track.";
        newBar.innerText = remCash;
        node.append(newBar);
    };
    self.supplementAdded = function (nodeId) {
        let supplementNode = document.getElementById(PREFIX + nodeId);
        return Boolean(supplementNode);
    };
    self.batchAddComponents = function () {
        for (let i = 0; i < self.nodes.length; i++) {
            var node = self.nodes[i];
            setTimeout(function () {
                if (!self.supplementAdded(node.id)) {
                    self.doAddBudgetBarSupplement(node);
                }
            }, 1);
        }
    };
}
