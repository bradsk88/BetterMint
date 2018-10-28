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
			if (n.length == 0) {
					return;
			}
            self.nodes.push(n[0]);
    };
    self.doAddComponent = function(node) {
			var btn  = document.createElement('a');
			btn.id = SPLIT_PREFIX + node.parentElement.id;
			btn.classList.add("btn","btn-sm", "btn-hollow", "autosplit-button");
			btn.innerText = "Auto";

			var containsAny = function(r, cls) {
				for (var c of cls) {
					if (r.classList.contains(c)) {
						return true;
					}
				}
				return false;
			};

			var handler = {
					node: node,
					handle: function() {

							var getAmount = (row) => {
									var input = row.getElementsByClassName('innerAmount')[0].getElementsByTagName('input')[0];
									var str = input.value.substr(1);
									return Number.parseFloat(str);
							};

							var setAmount = (num) => {
									console.log(num);
									var input = node.getElementsByClassName('innerAmount')[0].getElementsByTagName('input')[0];
									input.value = `$${num}`
							}

							var total = document.getElementsByTagName('thead')[0].children[0].children[2].innerText.substr(1);
							total = Number.parseFloat(total);
							
							var allRows = [].slice.call(this.node.parentElement.parentElement.getElementsByTagName('tr'));
							allRows = allRows.filter(r => !containsAny(r, ['hide'])); // TODO: still needed?
							allRows = allRows.map(r => r.getElementsByClassName('amount-cell')[0]);
							allRows = allRows.filter(r => r !== node);
							var amounts = allRows.map(r => getAmount(r));
							var amount = amounts.reduce((coll, a) => {
									return coll + a;
							});
							setAmount(total - amount);
							
					}
			};

			btn.addEventListener('click', (function() {
					this.handle();
			}).bind(handler));
			node.append(btn);
    };
    self.supplementAdded = function(nodeId) {
        var supplementNode = document.getElementById(SPLIT_PREFIX + nodeId);
        return Boolean(supplementNode);
    };
    self.batchAddComponents = function() {
        for (var i = 0; i < self.nodes.length; i++) {
            var node = self.nodes[i];
            setTimeout(function () {
                if (!self.supplementAdded(node.parentElement.id)) {
                    self.doAddComponent(node);
                }
            }, 1);
        }
    };
}
