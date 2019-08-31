const SPLIT_PREFIX = 'planning-autosplit-';

function AutoSplitButton() {
    var self = this;
    self.nodes = [];
    self.consider = function(node) {
			if (!node) {
					return;
			}
			if (!node.innerText) {
					return;
			}
			if (node.innerText.indexOf("Demo Category") > -1) {
					return;
			}
			if (node.innerText.indexOf("SPLIT AGAIN") === -1) {
					return;
			}
			var n = node.getElementsByClassName('amount-cell');
			if (n.length === 0) {
					return;
			}
            self.nodes.push(n[0]);
    };

	function containsAny(r, cls) {
		for (var c of cls) {
			if (r.classList.contains(c)) {
				return true;
			}
		}
		return false;
	}

	function getAllRows(node) {
		var allRows = [].slice.call(node.parentElement.parentElement.getElementsByTagName('tr'));
		allRows = allRows.filter(r => !containsAny(r, ['hide'])); // TODO: still needed?
		allRows = allRows.map(r => r.getElementsByClassName('amount-cell')[0]);
		allRows = allRows.filter(r => r !== node);
		return allRows;
	}

	function autoFillField(node, total) {
		const allRows = getAllRows(node);
		var amounts = allRows.map(r => getAmount(r));
		var amount = amounts.reduce((coll, a) => {
			return coll + a;
		});
		setAmount(node, Math.round((total - amount) * 100) / 100);
	}

	function tipFillField(node, total) {
		const tipAmount = Math.floor(total * 20) / 100; // TODO: Settable
		const currentAmount = getAmount(node);
		if (tipAmount === currentAmount) {
			return;
		}
		const allRows = getAllRows(node);
		const firstRow = allRows[0];
		var amount = getAmount(firstRow);
		const remainderAmount = Math.ceil((amount - tipAmount) * 100) / 100;
		setAmount(node, tipAmount);
		setAmount(firstRow, remainderAmount);
	}


	function getAmount(row) {
		var input = row.getElementsByClassName('innerAmount')[0].getElementsByTagName('input')[0];
		var str = input.value.substr(1);
		return Number.parseFloat(str);
	}

	function setAmount(node, num) {
		console.log(num);
		var input = node.getElementsByClassName('innerAmount')[0].getElementsByTagName('input')[0];
		input.value = `$${num}`
	}

	self.doAddAutoComponent = function(node) {
			var btn  = document.createElement('a');
			btn.id = SPLIT_PREFIX + node.parentElement.id;
			btn.classList.add("btn","btn-sm", "btn-hollow", "autosplit-button");
			btn.innerText = "Auto";

			var handler = {
					node: node,
					handle: function() {
						var total = document.getElementsByTagName('thead')[0].children[0].children[2].innerText.substr(1);
						total = Number.parseFloat(total);
						autoFillField(node, total);
					}
			};

			btn.addEventListener('click', (function() {
					this.handle();
			}).bind(handler));
			node.append(btn);
    };
	self.doAddTipComponent = function(node) {
		var btn  = document.createElement('a');
		btn.id = SPLIT_PREFIX + node.parentElement.id;
		btn.classList.add("btn","btn-sm", "btn-hollow", "tip-button");
		btn.innerHTML = "<div>Tip<div>";

		var handler = {
			node: node,
			handle: function() {
				var total = document.getElementsByTagName('thead')[0].children[0].children[2].innerText.substr(1);
				total = Number.parseFloat(total);
				tipFillField(node, total);
			}
		};

		btn.addEventListener('click', (function() {
			this.handle();
		}).bind(handler));
		node.append(btn);
	};
    self.supplementAdded = function(nodeId, type) {
        var supplementNode = document.getElementById(SPLIT_PREFIX + nodeId + type);
        return Boolean(supplementNode);
    };
    self.addTipButton = function() {
    	return; // TODO: Add option to turn this on
		// TODO: make this button only show up on the last cell
		if (self.nodes.length === 0) {
			return;
		}
		const lastNode = self.nodes.slice(-1);
		lastNode.forEach((node) => {
			setTimeout(function () {
				if (!self.supplementAdded(node.parentElement.id, 'tip')) {
					self.doAddTipComponent(node);
				}
			}, 1);
		});
	};
    self.batchAddComponents = function() {
        for (var i = 0; i < self.nodes.length; i++) {
            var node = self.nodes[i];
            setTimeout(function () {
                if (!self.supplementAdded(node.parentElement.id, 'auto')) {
                    self.doAddAutoComponent(node);
                }
            }, 1);
        }

    };
}
