var s = document.createElement('script');
s.src = chrome.extension.getURL('script.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
var root = document.head||document.documentElement;
root.appendChild(s);