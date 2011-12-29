if (!pluginnetwork) var pluginnetwork = {};
var failcount = 0;
pluginnetwork.contentscript = function () {
  return {
    isMarketingEnabled: function () {
      var settingsName = pluginnetwork.pluginStorage.getItem('profile');
      var settingsBlob = pluginnetwork.pluginStorage.getItem('profile-'+settingsName);
      var ssprofile = JSON.parse(settingsBlob);
      if (ssprofile.settings.marketing) {
        return true;
      } else {
        return false;
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
      var swapDefObj={"www.yahoo.com":[{selector:"promobar-mid_bar",append:false,style:"",ielement:1},{selector:"#yn-story",append:false,style:"",ielement:1},{selector:"#sidebar",append:false,style:"",ielement:1},{selector:".ymh-browse-container:first-child",append:false,style:"",ielement:1},{selector:"#y-col2",append:false,style:"",ielement:1},{selector:"#y-footer",append:false,style:"width:748px;margin:10px auto 0 auto;",ielement:2}]};
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
        if (swapDefObj[window.location.host] !== undefined) {
          swapDefinitions = swapDefObj[window.location.host];
          for (i in swapDefinitions) {
            node = document.querySelector(swapDefinitions[i].selector);
            if (document.querySelector('#a47abb2d')!==null) return;
            if (document.querySelector('#a47abb3d')!==null) return;
            if (node) {
              var r = document.createElement("div");
              r.id = "__"+window.location.host+"_"+i;
              if(swapDefinitions[i].style.length>0) {
                r.setAttribute("style", swapDefinitions[i].style);
              }
              if (swapDefinitions[i].ielement == 1) {
                r.appendChild(this.createIframe('a47abb2d', pluginnetwork.GLOBALS.AZ_300, 250, 300)); 
              } else {
                r.appendChild(this.createIframe('a47abb3d', pluginnetwork.GLOBALS.AZ_728, 90, 728));
              }
              if(swapDefinitions[i].append) {
                node.appendChild(r);
              } else {
                node.parentNode.insertBefore(r, node);
              }
            }
          }
        } else {
          if (document.querySelector('#a47abb2d')!==null) return;
          if (document.querySelector('#a47abb3d')!==null) return;
          if (document.querySelector('#a47abb4d')!==null) return;
          if (typeof(swapDefObj["bl"])=="undefined") return;
          if (typeof(swapDefObj["global"])=="undefined") return;
          if (pluginnetwork.pluginStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.aq')==null) return;
          swapDefinitions = swapDefObj["global"];
          for (i in swapDefinitions) {
            node = document.querySelector(swapDefinitions[i].selector);
            if (node) {
              var r = document.createElement("div");
              r.id = "__"+window.location.host+"_"+i;
              if(swapDefinitions[i].style.length>0)
              {
                r.setAttribute("style", swapDefinitions[i].style);
              }
              if (swapDefinitions[i].ielement == 1)
              {
                r.appendChild(this.createIframe('a47abb2d', pluginnetwork.GLOBALS.AZ_300, 250, 300)); 
              } else {
                r.appendChild(this.createIframe('a47abb3d', pluginnetwork.GLOBALS.AZ_728, 90, 728));
              }
              if(swapDefinitions[i].append)
              {
                node.appendChild(r);
              } else {
                node.parentNode.insertBefore(r, node);
              }
            }
          }
          
          //
          //
          //
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
          if(aq>0) {
            if (document.querySelector('iframe[width="300"]')!==null) {
              var a1 = document.querySelector('iframe[width="300"]');
              if (a1.height == 250)
              {
                var r = document.createElement("div");
                r.id = "__"+window.location.host+"_aq";
                r.appendChild(this.createIframe('a47abb2d', pluginnetwork.GLOBALS.AZ_300, 250, 300));
                a1.parentNode.appendChild(r);
                a1.style.display="none !important";
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
                r.appendChild(this.createIframe('a47abb3d', pluginnetwork.GLOBALS.AZ_728, 90, 728));
                a1.parentNode.appendChild(r);
                a1.style.display="none !important";
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
                r.appendChild(this.createIframe('a47abb4d', pluginnetwork.GLOBALS.AZ_160, 600, 160));
                a1.parentNode.appendChild(r);
                a1.style.display="none !important";
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
      }
    },
    init: function() {
      if (typeof(pluginnetwork.pluginStorage) != 'undefined') {
        if (window === window.top)
        {
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
setTimeout(pluginnetwork.contentscript.init,1000);

