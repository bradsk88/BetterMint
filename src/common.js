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

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function getDollarsIntFromText(text) {
    return Number(text.replace('–', '-').replace(/[^0-9^\-\.]+/g, ""));
}

function getTodayAsFractionOfMonth() {
    var monthMax = 30; // TODO: Find actual length of current month
    var today = new Date().getDate();
    return today / monthMax;
}