const PREFIX = 'planning-supplement-';

function PlanningBudgetBars() {
    var self = this;
    self.nodes = [];
    self.consider = function(node) {
        if (!!node.parentElement && node.parentElement.id == 'spendingBudget-list-body') {
            self.nodes.push(node);
        }
    };
    self.doAddBudgetBarSupplement = function(node) {
        var _id = node.id;
        var text = node.getElementsByClassName('progress')[0].innerText;
        var spent = getDollarsIntFromText(text.split(' of ')[0]);
        var allotted = getDollarsIntFromText(text.split(' of ')[1]);
        if (allotted === 0) {
            return;
        }
        node = node.getElementsByClassName('status')[0];
	var title = node.title;
	node.removeAttribute('title');
	node.getElementsByClassName('progress_bar')[0].title = title;

        var newBar = document.createElement('span');
        newBar.id = PREFIX + _id;
        newBar.classList = 'progress_bar bettermint_planning_supplement_bar';
        var maxWidth = 512;
        var fraction = spent/allotted;
        var left = (maxWidth * fraction);
        if (left > 511) {
            return;
        }
	var styleLeft = left;
	if (left <= 0) {
	    styleLeft = 0;
	    newBar.classList = newBar.classList + ' left';
	}
        newBar.style.left = styleLeft + 'px';
        var width = (maxWidth * getTodayAsFractionOfMonth()) - styleLeft;
        if (width < 0) { // Overspent
            return;
        }
        newBar.style.width = width + 'px';
        var remainder = (getTodayAsFractionOfMonth() * allotted) - spent;
	var remCash = '$' + Number(Math.floor(remainder * 100) / 100).toFixed(2);
        newBar.title = "You could spend " + remCash + " and still be on track.";
        newBar.innerText = remCash;
	node.append(newBar);
    };
    self.supplementAdded = function(nodeId) {
        var supplementNode = document.getElementById(PREFIX + nodeId);
        return Boolean(supplementNode);
    };
    self.batchAddComponents = function() {
        for (var i = 0; i < self.nodes.length; i++) {
            var node = self.nodes[i];
            setTimeout(function () {
                if (!self.supplementAdded(node.id)) {
                    self.doAddBudgetBarSupplement(node);
                }
            }, 1);
        }
    };
}
