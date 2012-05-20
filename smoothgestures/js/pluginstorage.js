if (!pluginnetwork) var pluginnetwork = {};
pluginnetwork.pluginStorage = {};

function setupStorage (response) {
  pluginnetwork.pluginStorage = response;
  pluginnetwork.pluginStorage.getItem = function(key){
    if (typeof(pluginnetwork.pluginStorage[key]) != 'undefined') return pluginnetwork.pluginStorage[key];
    return null;
  }
  pluginnetwork.pluginStorage.setItem = function(key, value) {
          pluginnetwork.pluginStorage[key] = value;
          var thisJSON =  {
              requestType: 'localStorage',
              operation: 'setItem',
              itemName: key,
              itemValue: value
          }
          chrome.extension.sendRequest(thisJSON, function(response) {
              // this is an asynchronous response, we don't really need to do anything here...
          });
  }
  pluginnetwork.pluginStorage.removeItem =  function(key) {
    delete pluginnetwork.pluginStorage[key];
    var thisJSON =  {
      requestType: 'localStorage',
      operation: 'removeItem',
      itemName: key
    }
    chrome.extension.sendRequest(thisJSON, function(response) {
    // this is an asynchronous response, we don't really need to do anything here...
    });
  }
}
function bootStrap() {
  var thisJSON = {
    requestType: 'getLocalStorage'
  }
  chrome.extension.sendRequest(thisJSON, function(response) {
      setupStorage(response);
      //console.log('setup storage');
  });
}
bootStrap();