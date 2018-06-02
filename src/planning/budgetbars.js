const PREFIX = 'planning-supplement-';

function PlanningBudgetBars() {
    let self = this;
    self.nodes = [];
    self.consider = function (node) {
        if (!!node.parentElement && node.parentElement.id == 'spendingBudget-list-body') {
            self.nodes.push(node);
        }
    };
    self.buildBudgetBar = function (spent, allotted) {
        const newBar = document.createElement('span');
        newBar.classList = 'progress_bar bettermint_planning_supplement_bar';
        let maxWidth = 512;
        let fraction = spent / allotted;
        let left = (maxWidth * fraction);
        if (left > 511) {
            return null;
        }
        let styleLeft = left;
        if (left <= 0) {
            styleLeft = 0;
            newBar.classList = newBar.classList + ' left';
        }
        newBar.style.left = styleLeft + 'px';
        let width = (maxWidth * getTodayAsFractionOfMonth()) - styleLeft;
        if (width < 0) { // Overspent
            return null;
        }
        newBar.style.width = width + 'px';
        let remainder = (getTodayAsFractionOfMonth() * allotted) - spent;
        let remCash = '$' + Number(Math.floor(remainder * 100) / 100).toFixed(2);
        newBar.title = "You could spend " + remCash + " and still be on track.";
        newBar.innerText = remCash;
        return newBar;
    };
    self.clampButtonClicked = function() {
        const updater = document.getElementById('pop-budget');
        window['$MC']['Planning'].openBudgetPopup(); // FIXME: Don't have access to this because of sandbox
        document.getElementById('pop-budget-2-amount').value = 111;
        document.getElementById('pop-budget-frequency-0').value = 0;
        // document.getElementById('pop-budget-submit').click();
    };
    self.buildBudgetButton = function() {
        const newButton = document.createElement('button');
        newButton.innerText = 'GO!';
        newButton.classList.add('clampButton');
        newButton.onclick = self.clampButtonClicked;
        return newButton;
    };
    self.doAddBudgetBarSupplement = function (node) {
        const parent = node;
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

        const newBar = self.buildBudgetBar(spent, allotted);
        if (newBar !== null) {
            node.append(newBar);
        }
        const newButton = self.buildBudgetButton();
        if (newButton !== null) {
            parent.append(newButton);
        }
        const proof = document.createElement('span');
        proof.id = PREFIX + parent.id;
        parent.append(proof);

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
