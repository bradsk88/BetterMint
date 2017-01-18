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
