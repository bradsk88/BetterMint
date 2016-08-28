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

function initializeBetterMint(leftColumnNode) {
    setTimeout(function() {
        var badge = document.createElement("div");
        badge.classList = ['bm-header-badge'];
        badge.innerHTML = "BetterMint Extension is Active";
        leftColumnNode.innerHTML = badge.outerHTML + leftColumnNode.innerHTML
    }, 2000);
}

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
            var node = mutation.addedNodes[i];
            if (!node) {
                continue;
            }
            if (hasClass(node, 'OverviewPageView')) {
                // Add top bar?
                initializeBetterMint(node);
            }
            if (node.id == 'overview-left-column') {
//                initializeBetterMint(node);
            }
        }
        return true;
    });
});
observer.observe(document, { childList: true, subtree: true });