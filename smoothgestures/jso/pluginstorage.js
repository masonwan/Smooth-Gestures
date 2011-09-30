//
// Plugin storage v.01
// This file provides contentscripts access to a localstorage object or a Mozilla preferences object
// to save settings that require persistence.
//

pluginStorage = {};
function setUppluginStorage (response) {
    if (typeof(chrome) != 'undefined') {
        pluginStorage = response;
        pluginStorage.getItem = function(key) {
            if (typeof(pluginStorage[key]) != 'undefined') return pluginStorage[key];
            return null;
        }
        pluginStorage.setItem = function(key, value) {
            pluginStorage[key] = value;
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
        pluginStorage.removeItem = function(key) {
            delete pluginStorage[key];
            var thisJSON =  {
                requestType: 'localStorage',
                operation: 'removeItem',
                itemName: key
            }
            chrome.extension.sendRequest(thisJSON, function(response) {
                // this is an asynchronous response, we don't really need to do anything here...
            });
        }
        window.localStorage = pluginStorage;
    } else if (typeof(safari) != 'undefined') {
        pluginStorage = response;
        pluginStorage.getItem = function(key) {
            if (typeof(pluginStorage[key]) != 'undefined') return pluginStorage[key];
            return null;
        }
        pluginStorage.setItem = function(key, value) {
            pluginStorage[key] = value;
            var thisJSON =  {
                requestType: 'localStorage',
                operation: 'setItem',
                itemName: key,
                itemValue: value
            }
            safari.self.tab.dispatchMessage("localStorage", thisJSON);
        }
        pluginStorage.removeItem = function(key) {
            delete pluginStorage[key];
            var thisJSON =  {
                requestType: 'localStorage',
                operation: 'removeItem',
                itemName: key
            }
            safari.self.tab.dispatchMessage("localStorage", thisJSON);
        }
        window.localStorage = pluginStorage;
    } else if (typeof(opera) != 'undefined') {
        pluginStorage = response;
        pluginStorage.getItem = function(key) {
            if (typeof(pluginStorage[key]) != 'undefined') return pluginStorage[key];
            return null;
        }
        pluginStorage.setItem = function(key, value) {
            pluginStorage[key] = value;
            var thisJSON =  {
                requestType: 'localStorage',
                operation: 'setItem',
                itemName: key,
                itemValue: value
            }
            opera.extension.postMessage(JSON.stringify(thisJSON));
        }
        pluginStorage.removeItem = function(key) {
            delete pluginStorage[key];
            var thisJSON =  {
                requestType: 'localStorage',
                operation: 'removeItem',
                itemName: key
            }
            opera.extension.postMessage(JSON.stringify(thisJSON));
        }
        window.localStorage = pluginStorage;
    } else {
        pluginStorage = {};
        var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
        pluginStorage.getItem = function(key) {
            var prefString = "";
            try {
                prefString = prefManager.getCharPref(key);
            } catch (err) {
            }
            if (prefString == "" || !prefString) {
                return null;
            } else {
                return prefManager.getCharPref(key);
            }
        }
        pluginStorage.setItem = function(key, value) {
            if (typeof(value) != 'undefined') {
                // if ((typeof(value) == 'number') && (value > 2147483647)) {
                if (typeof(value) == 'number') {
                    value = value.toString();
                }
                prefManager.setCharPref(key, value);
            }
            return true;
        }
        pluginStorage.removeItem = function(key) {
            prefManager.clearUserPref(key);
            return true;
        }
    }
}
function bootStrap()
{
    if (typeof(opera) != 'undefined') {
        opera.extension.addEventListener( "message", operaMessageHandler, false);
        window.addEventListener("DOMContentLoaded", function(u) {
            thisJSON = {
                    requestType: 'getLocalStorage'
            }
            opera.extension.postMessage(JSON.stringify(thisJSON));
        }, false);
    } else {
        (function(u) {
            if (typeof(chrome) != 'undefined') {
                var thisJSON = {
                        requestType: 'getLocalStorage'
                }
                chrome.extension.sendRequest(thisJSON, function(response) {
                    setUppluginStorage(response);
                    //console.log('setup storage');
                });
            } else if (typeof(safari) != 'undefined') {
                thisJSON = {
                        requestType: 'getLocalStorage'
                }
                safari.self.tab.dispatchMessage("getLocalStorage", thisJSON);
            }
        })();
    }
}
bootStrap();