/**
 * FuturePlanningEditor adds controls for opening the "next month budget", etc. planning tools.
 */
const FuturePlanningEditor = function() {
    const self = this;
    self.nodes = [];

    function isOverviewSection (node) {
        return hasClass(node, 'OverviewPageView');
    }

    function getWidget(node) {
        let widget = node.getElementsByClassName('budgetsWidget');
        if (widget.length !== 1) {
            return null;
        }
        return widget[0];
    }

    function getHeader(node) {
        const budgets = getWidget(node);
        if (!budgets) {
            return null;
        }
        let headers = budgets.getElementsByClassName('cardHeader');
        if (headers.length !== 1) {
            return null;
        }
        return headers[0];
    }

    const addFuturePlanningButtons = function(node) {
        const header = getHeader(node);
        const button = document.createElement("object");
        button.style.pointerEvents = "none";
        button.classList.add("button");
        button.setAttribute("type", "image/svg+xml");
        button.setAttribute("height", "25");
        button.setAttribute("width", "25");
        const href = chrome.extension.getURL("ext-images/future-planning.svg");
        button.setAttribute("data", href);

        const container = document.createElement("div");
        container.setAttribute("title", "Create a budget for next month");
        container.classList.add('future-planning-open');
        container.appendChild(button);
        header.appendChild(container);
        container.addEventListener('click', self.openFuturePlanning);
        console.log("Event listener added");
    };

    // Public methods
    self.consider = function(node) {
        if (isOverviewSection(node)) {
            self.nodes.push(node);
            self.needsPurge = true;
        }
    };
    self.batchAddComponents = function() {
        if (self.needsPurge) {
            removeElementsByClass('future-planning-open');
            self.needsPurge = false;
        }
        self.nodes.map(node => {
            addFuturePlanningButtons(node);
        });
    };
    self.openFuturePlanning = function() {
        const budgets = getWidget(document);
        budgets.appendChild(self.buildPlanningPane());
    };
    self.buildPlanningPane = function() {
        const outer = document.createElement("div");
        outer.id = "future-planning-pane";
        outer.classList.add("CardView");

        const header = document.createElement("header");
        header.classList.add("cardHeader");
        header.innerHTML = "<h3>NEXT MONTH</h3>";

        const income = self.buildIncomeInput();

        const content = document.createElement("div");
        content.classList.add("cardContent");
        content.appendChild(income);

        outer.appendChild(header);
        outer.appendChild(content);

        return outer;
    };
    self.buildIncomeInput = function() {
        const income = document.createElement("input");
        income.setAttribute("type", "text");
        income.addEventListener('blur', () => {
            chrome.storage.sync.set({income: income.value}, function() {
                console.log('income is set to ' + income.value);
            });
        });
        chrome.storage.sync.get(['income'], function(value) {
            income.value = value.income;
        });
        return income;
    };

};
