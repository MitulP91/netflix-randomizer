// When clicking the extension icon, load in the netflix randomizer script.
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, {file: 'index.js'});
});