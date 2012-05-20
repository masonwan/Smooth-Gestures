///////////////////////////////////////////////////////////
// Local Variables ////////////////////////////////////////
///////////////////////////////////////////////////////////
var navWin = navigator.platform.indexOf("Win") != -1;
var navMac = navigator.platform.indexOf("Mac") != -1;
var navLinux = navigator.platform.indexOf("Linux") != -1;

var instanceId = null;
var profile = null;
var bookmarksync = null;
var extVersion = null;
var log = {action:{}};

var extId = chrome.extension.getURL("").substr(19,32);
var nav = navigator.platform.match(/Win/) ? "win" :
         (navigator.platform.match(/Mac/) ? "mac" :
         (navigator.platform.match(/Linux/) ? "linux" : "unknown"));
var chromeVersion = navigator.userAgent.replace(/^.*Chrome\/(\d+)\D.*$/, "$1")*1;

var pluginport = null;

var contents = {};
var prevSelectedTabId = null;
var selectedTabId = null;
var focusedWindows = [];
var activeTabs = {};
var closedTabs = [];
var loadHistory = {};
var validGestures = null;
var gesturesjs = null;

var chainGesture = null;

var customActions = {}; //title,[descrip],code,env,share,context
var externalActions = {};

var localCopy = {};

var gestures = {};
var settings = {};




///////////////////////////////////////////////////////////
// System Defaults ////////////////////////////////////////
///////////////////////////////////////////////////////////
var defaults = {};

defaults['Smooth Gestures'] = {};
defaults['Smooth Gestures'].settings = JSON.stringify({
  holdButton: 2,
  contextOnLink: false,
  newTabUrl: "chrome://newtab/",
  newTabRight: false,
  newTabLinkRight: true,
  trailColor: {r:255,g:0,b:0,a:1},
  trailWidth: 2,
  trailBlock: false,
  blacklist: [],
  selectToLink: true,
  marketing: true,
  'hide-empty-cat_hacks': true
})
defaults['Smooth Gestures'].gestures = JSON.stringify({
  'U':      'new-tab',
  'lU':     'new-tab-link',
  'D':      'toggle-pin',
  'L':      'page-back',
  'rRL':    'page-back',
  'R':      'page-forward',
  'rLR':    'page-forward',
  'UL':     'prev-tab',
  'UR':     'next-tab',
  'wU':     'goto-top',
  'wD':     'goto-bottom',
  'DR':     'close-tab',
  'RL':     'undo-close',
  'UD':     'clone-tab',
  'lDU':    'new-tab-back',
  'DU':     'reload-tab',
  'UDU':    'reload-tab-full',
  'URD':    'view-source',
  'UDR':    'split-tabs',
  'UDL':    'merge-tabs',
  'LDR':    'show-cookies',
  'RDLUR':  'options',
  'RDLD':   'status'
});

defaults['Opera'] = {};
defaults['Opera'].settings = JSON.stringify({});
defaults['Opera'].gestures = JSON.stringify({
  'L':      'page-back',
  'rRL':    'page-back',
  'R':      'page-forward',
  'rLR':    'page-forward',
  'U':      'stop',
  'UD':     'reload-tab',
  'DR':     'close-tab',
  'RLR':    'close-tab',
  'D':      'new-tab',
  'lD':     'new-tab-link',
  'DU':     'clone-tab',
  'lDU':    'new-tab-back',
  'UL':     'parent-dir'
//  'UR':     'maximize',
//  'DL':     'minimize'
});

defaults['All-in-One Gestures'] = {};
defaults['All-in-One Gestures'].settings = JSON.stringify({});
defaults['All-in-One Gestures'].gestures = JSON.stringify({
  'L':      'page-back',
  'rRL':    'page-back',
  'R':      'page-forward',
  'rLR':    'page-forward',
  'UD':     'reload-tab',
  'UDU':    'reload-tab-full',
  'LU':     'stop',
  'U':      'new-tab',
  'RLR':    'new-tab-link',
  'DUD':    'clone-tab',
  'UL':     'prev-tab',
  'UR':     'next-tab',
  'DR':     'close-tab',
  'D':      'new-window',
  'URD':    'view-source',
  'LDR':    'show-cookies',
  'DRD':    'options'
//many other actions
});

defaults['FireGestures'] = {};
defaults['FireGestures'].settings = JSON.stringify({});
defaults['FireGestures'].gestures = JSON.stringify({
  'L':      'page-back',
  'R':      'page-forward',
  'UD':     'reload-tab',
  'UDU':    'reload-tab-full',
  'DRU':    'new-window',
  'URD':    'close-window',
  'LR':     'new-tab',
  'DR':     'close-tab',
  'RL':     'undo-close',
  'UL':     'prev-tab',
  'UR':     'next-tab',
  'LU':     'goto-top',
  'LD':     'goto-bottom',
  'lU':     'new-tab-link',
  'lD':     'new-tab-back',
  'LDRUL':  'options',
  'DU':     'parent-dir'
//  'RURU':   'url-dec-num',
//  'RDRD':   'url-inc-num',
//  'RUD':    'minimize',
//  'RDU':    'maximize',
//  'RD':     'search-selection'
});





var categories = {
  'cat_page_navigation': { actions: [
    'page-back',
    'page-forward',
    'page-back-close',
    'reload-tab',
    'reload-tab-full',
    'reload-all-tabs',
    'stop',
    'page-next',
    'page-prev'
  ]},
  'cat_tab_management': { actions: [
    'new-tab',
    'new-tab-link',
    'new-tab-back',
    'navigate-tab',
    'close-tab',
    'close-other-tabs',
    'close-left-tabs',
    'close-right-tabs',
    'undo-close',
    'clone-tab',
    'new-window',
    'new-window-link',
    'close-window',
    'prev-tab',
    'next-tab',
    'split-tabs',
    'merge-tabs',
    'tab-to-left',
    'tab-to-right',
    'toggle-pin',
    'pin',
    'unpin'
  ]},
  'cat_utilities': { actions: [
    'goto-top',
    'goto-bottom',
    'page-up',
    'page-down',
    'print',
    'parent-dir',
    'view-source',
    'show-cookies',
    'search-sel',
    'zoom-in',
    'zoom-out',
    'zoom-zero',
    'open-image',
    'hide-image',
    'zoom-img-in',
    'zoom-img-out',
    'zoom-img-zero',
    'translate',
    'copy',
    'toggle-bookmark',
    'bookmark',
    'unbookmark'
  ]},
  'cat_other': { actions: [
    'options',
    'status',
    'open-history',
    'open-downloads',
    'open-extensions',
    'open-bookmarks'
  ]},
  'cat_hacks': { actions: [
    'undo-close-hack',
    'clone-tab-hack',
    'prev-window',
    'next-window',
    'maximize-x',
    'minimize-x'
  ]},
  'cat_custom': { customActions:true },
  'cat_external': { externalActions:true },
  'cat_settings': { settings:true }
}





///////////////////////////////////////////////////////////
// Action Functions ///////////////////////////////////////
///////////////////////////////////////////////////////////
var contexts = {
  'new-tab-link': 'l',
  'new-tab-back': 'l',
  'new-window-link': 'l',
  'zoom-img-in':  'i',
  'zoom-img-out': 'i',
  'zoom-img-zero':'i',
  'open-image':   'i',
  'hide-image':   'i',
  'search-sel':   's',
  'translate':    's',
  'copy':         's'
}

var actions = {
  'new-tab':      function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    var prop = {url:settings.newTabUrl!="homepage"?settings.newTabUrl:undefined, windowId:tab.windowId};
                    if(settings.newTabRight) prop.index = tab.index+1;
                    chrome.tabs.create(prop, call); }); },
  'new-tab-link': function(id, call, a) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    for(var i=0; i<a.links.length; i++) {
                      var prop = {url:a.links[i].src, windowId:tab.windowId};
                      if(settings.newTabLinkRight) prop.index = tab.index+1+i;
                      chrome.tabs.create(prop, (i==a.links.length-1?call:null));
                    } }); },
  'new-tab-back': function(id, call, a) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    for(var i=0; i<a.links.length; i++) {
                      var prop = {url:a.links[i].src, windowId:tab.windowId, selected:false};
                      if(settings.newTabLinkRight) prop.index = tab.index+1+i;
                      chrome.tabs.create(prop, (i==a.links.length-1?call:null));
                    } }); },
  'navigate-tab': function(id, call) { chrome.tabs.update(contents[id].detail.tabId, {url:settings.newTabUrl!="homepage"?settings.newTabUrl:undefined}, call); },
  'close-tab':    function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) { if(tab.pinned) call(); else if(settings.closeLastBlock) {
                    chrome.windows.getAll({populate:true}, function(wins) {
                      if(wins.length == 1 && wins[0].tabs.length == 1)
                        chrome.tabs.update(contents[id].detail.tabId, {url:settings.newTabUrl!="homepage"?settings.newTabUrl:undefined}, call);
                      else chrome.tabs.remove(contents[id].detail.tabId, call);
                    }); } else chrome.tabs.remove(contents[id].detail.tabId, call); }); },
  'close-other-tabs': function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.tabs.getAllInWindow(tab.windowId, function(tabs) {
                      for(i=0; i<tabs.length; i++) if(tabs[i].id != tab.id && !tab.pinned) chrome.tabs.remove(tabs[i].id);
                      call(); }); }); },
  'close-left-tabs': function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.tabs.getAllInWindow(tab.windowId, function(tabs) {
                      for(i=0; i<tabs.length; i++) if(tabs[i].index < tab.index && !tab.pinned) chrome.tabs.remove(tabs[i].id);
                      call(); }); }); },
  'close-right-tabs': function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.tabs.getAllInWindow(tab.windowId, function(tabs) {
                      for(i=0; i<tabs.length; i++) if(tabs[i].index > tab.index && !tab.pinned) chrome.tabs.remove(tabs[i].id);
                      call(); }); }); },
  'undo-close':   function(id, call) { if(pluginport) { pluginport.postMessage(JSON.stringify({sendkey:{keys:["t"],mods:[navMac?"alt":"ctrl", "shift"]}})); call(); 
                  } else {
                    var t = closedTabs.pop();
                    if(t) chrome.windows.get(t.winId, function(win) {
                      if(win)
                        chrome.tabs.create({windowId:t.winId, index:t.index, url:t.history[t.history.length-1]}, call);
                      else
                        chrome.windows.create({url:t.history[t.history.length-1]}, function(win2) {
                          for(var i=0; i<closedTabs.length; i++)
                            if(closedTabs[i].winId == t.winId) closedTabs[i].winId = win2.id;
                          call(); });
                    }); else call(); } },
  'undo-close-hack': function(id, call) { var t = closedTabs.pop();
                    var maxhist = 10;
                    var start = t.history.length>maxhist ? t.history.length-maxhist : 0;
                    for(var i=start; i<t.history.length-1; i++) if(t.history[i].substr(0,4) != "http") start = i;
                    t.history = t.history.slice(start);
                    t.titles = t.titles.slice(start);
                    if(t) chrome.windows.get(t.winId, function(win) {
                      if(t.history.length > 1) {
                        var r = Math.random()+"";
                        loadHistory[r] = t.history.length;
                        for(var i=0; i<t.titles.length; i++) { var str = "";
                          for(var j=0; j<t.titles[i].length; j++) str += String.fromCharCode(t.titles[i].charCodeAt(j)+10);
                          t.titles[i] = str; }
                        for(var i=0; i<t.history.length; i++) { var str = "";
                          for(var j=0; j<t.history[i].length; j++) str += String.fromCharCode(t.history[i].charCodeAt(j)+10);
                          t.history[i] = str; }
                        var url = "http://www.google.com/?index=0#:--:"+r+":--:"+escape(JSON.stringify(t.titles))+":--:"+escape(JSON.stringify(t.history));
                      } else {
                        var url = t.history[0];
                      }
                      if(win)
                        chrome.tabs.create({windowId:t.winId, index:t.index, url:url}, call);
                      else
                        chrome.windows.create({url:url}, function(win2) {
                          for(var i=0; i<closedTabs.length; i++)
                            if(closedTabs[i].winId == t.winId) closedTabs[i].winId = win2.id;
                          call(); });
                    }); else call(); },
  'reload-tab':   function(id, call) { runJS(id, "location.reload()"); call(); },
  'reload-tab-full': function(id, call) { runJS(id, "location.reload(true)"); call(); },
  'reload-all-tabs': function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.tabs.getAllInWindow(tab.windowId, function(tabs) {
                      for(i=0; i<tabs.length; i++) chrome.tabs.update(tabs[i].id, {url:tabs[i].url});
                      call(); }); }); },
  'stop':         function(id, call) { runJS(id, "window.stop()"); call(); },
  'view-source':  function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.tabs.create({url:"view-source:"+(contents[id].detail.url?contents[id].detail.url:tab.url), windowId:tab.windowId, index:tab.index+1}, call); }); },
  'prev-tab':     function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.tabs.getAllInWindow(null, function(tabs) {
                      var newId = null;
                      for(i=tabs.length-1; i>=0; i--) {
                        newId = tabs[(tab.index+i)%tabs.length].id;
                        if(contentForTab(newId)) break; }
                      chrome.tabs.update(newId, {selected:true}, call); }); }); },
  'next-tab':     function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.tabs.getAllInWindow(null, function(tabs) {
                      var newId = null;
                      for(i=1; i<=tabs.length; i++) {
                        newId = tabs[(tab.index+i)%tabs.length].id;
                        if(contentForTab(newId)) break; }
                      chrome.tabs.update(newId, {selected:true}, call); }); }); },
  'page-back':    function(id, call) { runJS(id, "history.back()"); call(); },
  'page-forward': function(id, call) { runJS(id, "history.forward()"); call(); },
  'new-window':   function(id, call) { chrome.windows.create({url:settings.newTabUrl!="homepage"?settings.newTabUrl:undefined}, call); },
  'new-window-link': function(id, call, a) { for(var i=0; i<a.links.length; i++) {
                    chrome.windows.create({url:a.links[i].src}, (i==a.links.length-1?call:null)); } },
  'close-window': function(id, call) { chrome.windows.getCurrent(function(win) { chrome.windows.remove(win.id, call); });},
  'split-tabs':   function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.windows.get(tab.windowId, function(win) {
                      chrome.tabs.getAllInWindow(win.id, function(tabs) {
                        chrome.windows.create({incognito:win.incognito}, function(newwin) {
                          for(i=tab.index; i<tabs.length; i++) { chrome.tabs.move(tabs[i].id, {windowId:newwin.id, index:i-tab.index}); }
                          chrome.tabs.getAllInWindow(newwin.id, function(newtabs) {
                            chrome.tabs.remove(newtabs[newtabs.length-1].id);
                            chrome.tabs.update(newtabs[0].id, {selected:true}, call); }); }); }); }); }); },
  'merge-tabs':   function(id, call) {
                    chrome.tabs.getAllInWindow(null, function(tabs) {
                      var winId = focusedWindows[focusedWindows.length-2];
                      if(winId) {
                        for(i=0; i<tabs.length; i++) chrome.tabs.move(tabs[i].id, {windowId:winId, index:1000000});
                        chrome.tabs.update(contents[id].detail.tabId, {selected:true}, call);
                      }
                    }); },
  'options':      function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.tabs.create({url:chrome.extension.getURL("options.html"), windowId:tab.windowId}, call); }); },
  'status':       function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.tabs.create({url:chrome.extension.getURL("status.html"), windowId:tab.windowId}, call); }); },
  'page-back-close': function(id, call) { runJS(id, "history.back();"+(activeTabs[contents[id].detail.tabId].history.length==1?" setTimeout(function(){ port.postMessage(JSON.stringify({closetab:true})); },400);":"")); call(); },
  'goto-top':     function(id, call, a) { runJS(id, (a.startPoint?"for(var t = document.elementFromPoint("+a.startPoint.x+","+a.startPoint.y+"); t!=document.documentElement && t!=document.body && (t.scrollHeight<=t.clientHeight || t.scrollTop==0 || ['auto','scroll'].indexOf(document.defaultView.getComputedStyle(t)['overflow-y'])==-1); t = t.parentNode); if(t == document.documentElement) t = document.body; t.scrollTop = 0":"document.body.scrollTop = 0")); call(); },
  'goto-bottom':  function(id, call, a) { runJS(id, (a.startPoint?"for(var t = document.elementFromPoint("+a.startPoint.x+","+a.startPoint.y+"); t!=document.documentElement && t!=document.body && (t.scrollHeight<=t.clientHeight || t.scrollTop==t.scrollHeight-t.clientHeight || ['auto','scroll'].indexOf(document.defaultView.getComputedStyle(t)['overflow-y'])==-1); t = t.parentNode); if(t == document.documentElement) t = document.body; t.scrollTop = t.scrollHeight":"document.body.scrollTop = document.body.scrollHeight")); call(); },
  'page-up':      function(id,call,a) { runJS(id, (a.startPoint?"for(var t = document.elementFromPoint("+a.startPoint.x+","+a.startPoint.y+"); t!=document.documentElement && t!=document.body && (t.scrollHeight<=t.clientHeight || t.scrollTop==0 || ['auto','scroll'].indexOf(document.defaultView.getComputedStyle(t)['overflow-y'])==-1); t = t.parentNode); if(t == document.documentElement) t = document.body; t.scrollTop -= .8*Math.min(document.documentElement.clientHeight,t.clientHeight)":"document.body.scrollTop -= .8*document.documentElement.clientHeight")); call(); },
  'page-down':    function(id,call,a) { runJS(id, (a.startPoint?"for(var t = document.elementFromPoint("+a.startPoint.x+","+a.startPoint.y+"); t!=document.documentElement && t!=document.body && (t.scrollHeight<=t.clientHeight || t.scrollTop==t.scrollHeight-t.clientHeight || ['auto','scroll'].indexOf(document.defaultView.getComputedStyle(t)['overflow-y'])==-1); t = t.parentNode); if(t == document.documentElement) t = document.body; t.scrollTop += .8*Math.min(document.documentElement.clientHeight,t.clientHeight)":"document.body.scrollTop += .8*document.documentElement.clientHeight")); call(); },
  'page-next':    function(id,call) { runJS(id, "var url = null;"
                    +"if(!url) { var links = $('link[rel=next][href]');"
                      +"if(links.length > 0) url = links[0].href; }"
                    +"if(!url) { var anchors = $('a[rel=next][href]');"
                      +"if(anchors.length > 0) url = anchors[0].href; }"
                    +"if(!url) { var anchors = $('a[href]');"
                      +"for(var i=0; i<anchors.length; i++) {"
                        +"if($(anchors[i]).text().match(/(next|下一页|下页)/i)) { url = anchors[i].href; break; }}}"
                    +"if(!url) { var anchors = $('a[href]');"
                      +"for(var i=0; i<anchors.length; i++) {"
                        +"if($(anchors[i]).text().match(/(>|›)/i)) { url = anchors[i].href; break; }}}"
                    +"if(url) location.href = url;"
                  , true); call(); },
  'page-prev':    function(id,call) { runJS(id, "var url = null;"
                    +"if(!url) { var links = $('link[rel=prev][href]');"
                      +"if(links.length > 0) url = links[0].href; }"
                    +"if(!url) { var anchors = $('a[rel=prev][href]');"
                      +"if(anchors.length > 0) url = anchors[0].href; }"
                    +"if(!url) { var anchors = $('a[href]');"
                      +"for(var i=0; i<anchors.length; i++) {"
                        +"if($(anchors[i]).text().match(/(prev|上一页|上页)/i)) { url = anchors[i].href; break; }}}"
                    +"if(!url) { var anchors = $('a[href]');"
                      +"for(var i=0; i<anchors.length; i++) {"
                        +"if($(anchors[i]).text().match(/(<|‹)/i)) { url = anchors[i].href; break; }}}"
                    +"if(url) location.href = url;"
                  , true); call(); },
  'clone-tab':    function(id, call, a) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.tabs.create({url:tab.url, selected:false, windowId:tab.windowId, index:tab.index}, call); }); },
  'clone-tab-hack': function(id, call) { var t = activeTabs[contents[id].detail.tabId];
                    var maxhist = 10;
                    var start = t.history.length>maxhist ? t.history.length-maxhist : 0;
                    for(var i=start; i<t.history.length-1; i++) if(t.history[i].substr(0,4) != "http") start = i;
                    var tabhistory = t.history.slice(start);
                    var tabtitles = t.titles.slice(start);
                    if(t) chrome.windows.get(t.winId, function(win) {
                      if(tabhistory.length > 1) {
                        var r = Math.random()+"";
                        loadHistory[r] = tabhistory.length;
                        for(var i=0; i<tabtitles.length; i++) { var str = "";
                          for(var j=0; j<tabtitles[i].length; j++) str += String.fromCharCode(tabtitles[i].charCodeAt(j)+10);
                          tabtitles[i] = str; }
                        for(var i=0; i<tabhistory.length; i++) { var str = "";
                          for(var j=0; j<tabhistory[i].length; j++) str += String.fromCharCode(tabhistory[i].charCodeAt(j)+10);
                          tabhistory[i] = str; }
                        var url = "http://www.google.com/?index=0#:--:"+r+":--:"+escape(JSON.stringify(tabtitles))+":--:"+escape(JSON.stringify(tabhistory));
                      } else {
                        var url = tabhistory[0];
                      }
                      chrome.tabs.create({url:url, windowId:win.windowId, selected:false, index:t.index}, call);
                    }); else call(); },
  'prev-window':  function(id, call) { if(focusedWindows.length <= 1) call(); else focusWindow(focusedWindows[focusedWindows.length-2], call); },
  'next-window':  function(id, call) { if(focusedWindows.length <= 1) call(); else focusWindow(focusedWindows[0], call); },
  'maximize-x':   function(id, call) { chrome.windows.getLastFocused(function(win) {
                    if(!maximizeXWindow[win.id]) {
                      maximizeXWindow[win.id] = {dim:win};
                      chrome.windows.update(win.id, {left:(screen.availWidth>screen.availHeight
                                                                    &&win.left>=screen.availWidth/2?screen.availWidth/2:0), top:0,
                                                                width:(screen.availWidth>screen.availHeight?.5:1)*screen.availWidth,
                                                                height:screen.availHeight}, call); }
                    else {
                      var dim = maximizeXWindow[win.id].dim;
                      maximizeXWindow[win.id] = null;
                      chrome.windows.update(win.id, {left:dim.left, top:dim.top, width:dim.width, height:dim.height}, function() { setTimeout(function() {
                        chrome.windows.update(win.id, {left:dim.left, top:dim.top, width:dim.width, height:dim.height}, call); },10); }); } }); },
  'minimize-x':   function(id, call) { chrome.windows.getLastFocused(function(mwin) {
                    chrome.windows.update(mwin.id, {left:screen.availWidth-10, top:screen.availHeight-10, width:10, height:10}, function() { setTimeout(function() {
                      chrome.windows.update(mwin.id, {left:screen.availWidth-10, top:screen.availHeight-10, width:10, height:10}, function() {
                        var restore = function(winId, call2) {
                          if(winId != mwin.id) { call2(); return; }
                          chrome.windows.onFocusChanged.removeListener(restore);
                          minimizeXWindow[mwin.id] = null;
                          chrome.windows.update(mwin.id, {left:mwin.left, top:mwin.top, width:mwin.width, height:mwin.height}, call2); }
                        minimizeXWindow[mwin.id] = {dim:mwin, listener:restore};
                        chrome.windows.onFocusChanged.addListener(restore);
                        for(var i=focusedWindows.length-2; i>=0 && minimizeXWindow[focusedWindows[i]]; i--);
                        if(i < 0) call(); else focusWindow(focusedWindows[i], call); }); },10); }); }); },
  'zoom-in':      function(id, call) { if(pluginport) { pluginport.postMessage(JSON.stringify({sendkey:{keys:["+"],mods:[navMac?"alt":"ctrl"]}})); call(); }
                                       else { runJS(id, "var zoom = document.body.style.zoom ? document.body.style.zoom*1.1 : 1.1; document.body.style.zoom = zoom; canvas.style.zoom = 1/zoom;"); call(); } },
  'zoom-out':     function(id, call) { if(pluginport) { pluginport.postMessage(JSON.stringify({sendkey:{keys:["-"],mods:[navMac?"alt":"ctrl"]}})); call(); }
                                       else { runJS(id, "var zoom = document.body.style.zoom ? document.body.style.zoom*(1/1.1) : 1/1.1; document.body.style.zoom = zoom; canvas.style.zoom = 1/zoom;"); call(); } },
  'zoom-zero':    function(id, call) { if(pluginport) { pluginport.postMessage(JSON.stringify({sendkey:{keys:["0"],mods:[navMac?"alt":"ctrl"]}})); call(); }
                                       else { runJS(id, "document.body.style.zoom = 1; canvas.style.zoom = 1;"); call(); } },
  'zoom-img-in':  function(id, call, a) { for(var i=0; i<a.images.length; i++) {
                    runJS(id, "var img = $('img[gestureid="+a.images[i].gestureid+"]'); if(img) { if(!img.attr('origsize')) img.attr('origsize', img.width()+'x'+img.height()); img.css({'width':img.width()*1.2, 'height':img.height()*1.2}); }"); } call(); },
  'zoom-img-out': function(id, call, a) { for(var i=0; i<a.images.length; i++) {
                    runJS(id, "var img = $('img[gestureid="+a.images[i].gestureid+"]'); if(img) { if(!img.attr('origsize')) img.attr('origsize', img.width()+'x'+img.height()); img.css({'width':img.width()/1.2, 'height':img.height()/1.2}); }"); } call(); },
  'zoom-img-zero': function(id, call, a) { for(var i=0; i<a.images.length; i++) {
                    runJS(id, "var img = $('img[gestureid="+a.images[i].gestureid+"]'); if(img && img.attr('origsize')) { var size = img.attr('origsize').split('x'); img.css({'width':size[0]+'px', 'height':size[1]+'px'}); }"); } call(); },
  'tab-to-left':  function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.tabs.move(tab.id, {index:tab.index>0?tab.index-1:0}); }); },
  'tab-to-right': function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.tabs.move(tab.id, {index:tab.index+1}); }); },
  'parent-dir':   function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    var parts = tab.url.split("#")[0].split("?")[0].split("/");
                    if(parts[parts.length-1] == "") parts = parts.slice(0,parts.length-1);
                    var url = null;
                    if(parts.length > 3) url = parts.slice(0,parts.length-1).join("/")+"/";
                    else url = parts.join("/")+"/";
                    if(url) chrome.tabs.update(tab.id, {url:url}, call); else call(); }); },
  'open-history': function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.tabs.create({url:"chrome://history/", windowId:tab.windowId}, call); }); },
  'open-downloads': function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.tabs.create({url:"chrome://downloads/", windowId:tab.windowId}, call); }); },
  'open-extensions': function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.tabs.create({url:"chrome://extensions/", windowId:tab.windowId}, call); }); },
  'open-bookmarks': function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.tabs.create({url:"chrome://bookmarks/", windowId:tab.windowId}, call); }); },
  'open-image':   function(id, call, a) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    for(var i=0; i<a.images.length; i++) {
                      chrome.tabs.create({url:a.images[i].src, windowId:tab.windowId}, call); } }); },
  'hide-image':   function(id, call, a) { for(var i=0; i<a.images.length; i++) {
                    runJS(id, "var img = $('img[gestureid="+a.images[i].gestureid+"]'); if(img) { img.css({'display':'none'}); }"); } call(); },
  'show-cookies': function(id, call) { var l=100; var m=5; runJS(id, "window.alert('Cookies stored by this host or domain:\\n'+('\\n'+document.cookie).replace(/; /g,';\\n').replace(/\\n(.{"+(l*2-8)+"})([^\\n]{"+(m)+"})/gm,\"\\n$1\\n        $2\").replace(/\\n(.{"+(l)+"})([^\\n]{"+(m)+"})/gm,\"\\n$1\\n        $2\"));", true); call(); },
  'search-sel':   function(id, call, a) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.tabs.create({url:"http://www.google.com/search?q="+a.selection, windowId:tab.windowId, index:tab.index+1}, call); }); },
  'print':        function(id, call) { runJS(id, "window.print()"); call(); },
  'translate':    function(id, call, a) { chrome.i18n.getAcceptLanguages(function(ls) {
                    $.post("http://ajax.googleapis.com/ajax/services/language/translate",
                           {"v":"1.0","langpair":"|"+ls[0].substr(0,2),"format":"html","q":a.selectionHTML}, function(data) {
                      try {
                        data = JSON.parse(data);
                        var resp = data.responseData;
                        var text = resp.translatedText;
                        alert(text);
                      } catch(e) {} }); }); call(); },
  'toggle-pin':   function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    if(chromeVersion >= 9) chrome.tabs.update(tab.id, {pinned:!tab.pinned}, call); }); },
  'pin':          function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    if(chromeVersion >= 9) chrome.tabs.update(tab.id, {pinned:true}, call); }); },
  'unpin':        function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    if(chromeVersion >= 9) chrome.tabs.update(tab.id, {pinned:false}, call); }); },
  'copy':         function(id, call, a) { if(!a.selection) return call();
                    var txt = document.createElement('textarea');
                    txt.value = a.selection;
                    document.body.appendChild(txt);
                    txt.select();
                    document.execCommand('Copy');
                    document.body.removeChild(txt);
                    call(); },
  'toggle-bookmark': function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.bookmarks.search(tab.url, function(bmks) {
                      if(bmks.length <= 0) chrome.bookmarks.create({parentId:"2", title:tab.title, url:tab.url}, call);
                      else chrome.bookmarks.remove(bmks[0].id, call); }); }); },
  'bookmark':     function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.bookmarks.create({parentId:"2", title:tab.title, url:tab.url}, call); }); },
  'unbookmark':   function(id, call) { chrome.tabs.get(contents[id].detail.tabId, function(tab) {
                    chrome.bookmarks.search(tab.url, function(bmks) {
                      if(bmks.length <= 0) call(); else chrome.bookmarks.remove(bmks[0].id, call); }); }); }
}


var runCustomAction = function(action, id, call, mess) {
  var action = customActions[action];
  if(!action) return;
  if(action.env == "page") {
    runJS(id, action.code);
    setTimeout(call, 50);
  } else if(action.env == "ext") {
    var func = new Function("id", "targets", action.code);
    func(id, mess);
    setTimeout(call, 50);
  }
}




///////////////////////////////////////////////////////////
// Window Position Hacks //////////////////////////////////
///////////////////////////////////////////////////////////
var minimizeXWindow = {};
var maximizeXWindow = {};
var focusWindow = function(winId, call) {
	if(focusedWindows.length <= 1) call(); else chrome.tabs.getSelected(winId, function(tab) {
    chrome.tabs.getAllInWindow(winId, function(tabs) {
      (minimizeXWindow[winId] ? function(winId, setDim) {
        if(minimizeXWindow[winId].listener) chrome.windows.onFocusChanged.removeListener(minimizeXWindow[winId].listener);
        var dim = minimizeXWindow[winId].dim;
        minimizeXWindow[winId] = null;
        setDim(dim);
      } : chrome.windows.get)(winId, function(win) {
        chrome.windows.create({left:win.left, top:win.top, width:win.width, height:win.height}, function(newwin) {
          for(i=0; i<tabs.length; i++) { chrome.tabs.move(tabs[i].id, {windowId:newwin.id, index:i}); }
          chrome.tabs.getAllInWindow(newwin.id, function(newtabs) {
            chrome.tabs.remove(newtabs[newtabs.length-1].id);
            chrome.tabs.update(tab.id, {selected:true}, call); }); }); }); }); });
}









///////////////////////////////////////////////////////////
// Communication //////////////////////////////////////////
///////////////////////////////////////////////////////////
chrome.extension.onRequest.addListener(function(request, sender, respond) {
  if(request.getstates) {
    getTabStates(function(states) {
      respond(JSON.stringify({states:states}));
    });

  } else if(request.log) {
    console.log(request.log);
    respond(null);
  } else if(request.requestType != undefined) {
	switch(request.requestType) {
	        case 'openNewTab':
	                chrome.tabs.create({
	                    index: 100000000, //last
	                    url:request.linkURL
	                });
	                break;
	        case 'getLocalStorage':
	                respond(localStorage);
	                break;
	        case 'saveLocalStorage':
	                for (var key in request.data) {
	                        localStorage.setItem(key,request.data[key]);
	                }
	                localStorage.setItem('importedFromForeground',true);
	                respond(localStorage);
	                break;
	        case 'localStorage':
	                switch (request.operation) {
	                        case 'getItem':
	                                respond({status: true, value: localStorage.getItem(request.itemName)});
	                                break;
	                        case 'removeItem':
	                                localStorage.removeItem(request.itemName);
	                                respond({status: true, value: null});
	                                break;
	                        case 'setItem':
	                                localStorage.setItem(request.itemName, request.itemValue);
	                                respond({status: true, value: null});
	                                break;
	                }
	                break;
	        default:
	                respond({status: "unrecognized request type"});
	}
  } else if(request.loadhistory != undefined) {
    if(loadHistory[request.id]) {
      if(request.loadhistory >= loadHistory[request.id]-1) delete loadHistory[request.id];
      respond(false);
    } else {
      respond(true);
    }

  } else if(request.reloadtab) {
    if(request.reloadtab == true) request.reloadtab = sender.tab.id;
    chrome.tabs.get(request.reloadtab, function(tab) {
      chrome.tabs.update(tab.id, {url:tab.url}, respond);
    });

  } else {
    respond(null);
  }
});

chrome.extension.onConnect.addListener(function(port) {
  if(port.sender && port.sender.tab) {
    port.detail = JSON.parse(port.name);
    if(!port.detail.id) return;
    port.detail.tabId = port.sender.tab.id;
    initConnectTab(port);
  }
});



// External ///////////////////////////////////////////////
///////////////////////////////////////////////////////////
chrome.extension.onRequestExternal.addListener(function(request, sender, respond) {
  //return js/gestures.js code
  if(request.getgestures) {
    if(gesturesjs)
      respond({gestures:gesturesjs});
    else {
      $.get(chrome.extension.getURL("js/gestures.js"), null, function(data) {
        gesturesjs = "window.SGextId='"+extId+"';\n"+data;
        respond({gestures:gesturesjs}); 
      });
    }

  } else if(request.externalactions) {
    var ex = request.externalactions;
    if(ex.name && ex.actions) {
      if(ex.actions.length > 0) {
        externalActions[sender.id] = ex;
        for(i=0; i<externalActions[sender.id].actions.length; i++)
          contexts[sender.id+"-"+externalActions[sender.id].actions[i].id] = externalActions[sender.id].actions[i].context;
      } else delete externalActions[sender.id];
      saveExternalActions();
      respond(true);
    } else
      respond(false);

  } else {
    respond(null);
  }
});
chrome.extension.onConnectExternal.addListener(function(port) {
  if(port.name == "sgplugin" && (port.sender.id == "bkojnmffeemeacfnhgiighecdfojgpdm" || port.sender.id == "apagmdofhjomjncpiebpaaonngppcpcl")) {
    pluginport = port;
    pluginport.onMessage.addListener(function(mess) {
    });
    pluginport.onDisconnect.addListener(function() {
      pluginport = null;
      for(id in contents) contents[id].postMessage(JSON.stringify({sgplugin:false}));
    });
    for(id in contents) contents[id].postMessage(JSON.stringify({sgplugin:true}));
  }
  if(port.sender.tab) {
    port.detail = JSON.parse(port.name);
    if(!port.detail.id) return;
    port.detail.tabId = port.sender.tab.id;
    initConnectTab(port);
  }
});



// Handle Gesture /////////////////////////////////////////
///////////////////////////////////////////////////////////
var contentMessage = function(id, mess) {
  mess = JSON.parse(mess);
  if(mess.selection && mess.selection.length>0 && gestures["s"+mess.gesture]) mess.gesture = "s"+mess.gesture;
  else if(mess.links && mess.links.length>0 && gestures["l"+mess.gesture]) mess.gesture = "l"+mess.gesture;
  else if(mess.images && mess.images.length>0 && gestures["i"+mess.gesture]) mess.gesture = "i"+mess.gesture;

  if(mess.gesture && gestures[mess.gesture]) {
    if(chainGesture) clearTimeout(chainGesture.timeout);
    chainGesture = null;
    if(mess.gesture[0]=="r") chainGesture = {rocker:true, timeout:setTimeout(function(){chainGesture=null},2000)};
    if(mess.gesture[0]=="w") chainGesture = {wheel:true,  timeout:setTimeout(function(){chainGesture=null},2000)};
    if(chainGesture && mess.buttonDown) chainGesture.buttonDown = mess.buttonDown;
    if(chainGesture && mess.startPoint) chainGesture.startPoint = mess.startPoint;
    var call = !chainGesture?null:function() {
      chrome.tabs.getSelected(null, function(tab) {
        if(!chainGesture) return;
        chainGesture.tabId = tab.id;
        for(id in contents)
          if(tab.id == contents[id].detail.tabId)
            contents[id].postMessage(JSON.stringify({chain:chainGesture}));
      }); }
    try {
      if(actions[gestures[mess.gesture]])
        actions[gestures[mess.gesture]].call(null, id, call, mess);
      else if(externalActions[gestures[mess.gesture].substr(0,32)])
        chrome.extension.sendRequest(gestures[mess.gesture].substr(0,32), {doaction:gestures[mess.gesture].substr(33)});
      else
        runCustomAction(gestures[mess.gesture], id, call, mess);
    } catch(err) {}
    if(!log.action) log.action = {};
    if(!log.action[gestures[mess.gesture]]) log.action[gestures[mess.gesture]] = {};
    if(!log.action[gestures[mess.gesture]][mess.gesture]) log.action[gestures[mess.gesture]][mess.gesture] = {count:0};
    log.action[gestures[mess.gesture]][mess.gesture].count += 1;

    if(!log.line) log.line = {distance:0, segments:0};
    if(mess.line) {
      log.line.distance += mess.line.distance;
      log.line.segments += mess.line.segments;
    }
  }
  if(mess.syncButton) {
    if(chainGesture) {
      if(!chainGesture.buttonDown) chainGesture.buttonDown = {};
      chainGesture.buttonDown[mess.syncButton.id] = mess.syncButton.down;
    }
    setTimeout(function() {
      chrome.tabs.getSelected(null, function(tab) {
        for(id in contents)
          if(tab.id == contents[id].detail.tabId)
            contents[id].postMessage(JSON.stringify({syncButton:mess.syncButton}));
      });
    }, 20);
  }
  if(mess.alertDoubleclick) {
    if(window.rightclickPopup) window.rightclickPopup.close();
    var width = 750;
    var height = 230;
    var wtop = mess.alertDoubleclick.centerY-height/1.5;
    var wleft = mess.alertDoubleclick.centerX-width/2;
    window.rightclickPopup = window.open("rightclick.html", "rightclick", "width="+width+",height="+height+",top="+wtop+",left="+wleft);
  }
  if(mess.closetab) {
    if(mess.closetab == true) mess.closetab = contents[id].detail.tabId;
    chrome.tabs.get(mess.closetab, function(tab) {
      chrome.tabs.remove(tab.id);
    });
  }
  if(mess.sgplugin && pluginport) {
    if(mess.sgplugin.rightclick) pluginport.postMessage(JSON.stringify({sendbutton:3}));
  }
}



// Connect Tabs ///////////////////////////////////////////
///////////////////////////////////////////////////////////
var initConnectTab = function(port) {
  if(!port.sender || !port.sender.tab || !port.detail.id) return;
  var tab = port.sender.tab;
  var id = port.detail.id;
  contents[id] = port;
  contents[id].onMessage.addListener(function(mess) {contentMessage(id, mess)});
  contents[id].onDisconnect.addListener(function() {delete contents[id]});
  var mess = {enable:true, extVersion:extVersion, settings:settings, validGestures:validGestures, sgplugin:(pluginport != null)};
  if(chainGesture && chainGesture.tabId == tab.id) {
    if(tab.selected)
      mess.chain = chainGesture;
    else {
      clearTimeout(chainGesture.timeout);
      chainGesture = null;
    }
  }
  var domain = tab.url.substr(tab.url.indexOf("//")+2);
  domain = domain.substr(0,domain.indexOf("/")).toLowerCase();
  for(var i=0; i<settings.blacklist.length; i++)
    if(settings.blacklist[i] == domain)
      mess.enable = false;
  contents[id].postMessage(JSON.stringify(mess));

  refreshPageAction(tab.id);
}


// Execute Code on Tab ////////////////////////////////////
///////////////////////////////////////////////////////////
var runJS = function(id, JS) {
  var mess = {eval:JS};
  if(contents[id]) contents[id].postMessage(JSON.stringify(mess));
}







///////////////////////////////////////////////////////////
// Tab Events /////////////////////////////////////////////
///////////////////////////////////////////////////////////

// Tab Selection //////////////////////////////////////////
///////////////////////////////////////////////////////////
var selectionChanged = function(tabId) {
  if(selectedTabId == tabId) return;
  for(id in contents)
    if(selectedTabId == contents[id].detail.tabId)
      contents[id].postMessage(JSON.stringify({windowBlurred:true}));
  prevSelectedTabId = selectedTabId;
  selectedTabId = tabId;
}
chrome.tabs.onSelectionChanged.addListener(selectionChanged);
chrome.windows.onFocusChanged.addListener(function(winId) {
  focusedWindows = focusedWindows.filter(function(el){ return (el != winId) });
  focusedWindows.push(winId);
  if(focusedWindows.length > 50) focusedWindows.shift();

  chrome.tabs.getSelected(null, function(tab) {
    selectionChanged(tab.id);
  });
});

// Tab Arangement /////////////////////////////////////////
///////////////////////////////////////////////////////////
var updateActiveTab = function(tabId, change) {
  chrome.tabs.get(tabId, function(tab) {
    if(change && change.url) { tab.url = change.url; tab.title = change.url; }
    if(tab.url.substr(0,29) == "http://www.google.com/?index=") {
      var p1 = tab.url.split("#");
      var p2 = p1[0].split("?");
      var parts = p1[1].substr(4).split(":--:");
      var id = parts[0];
      var titles = JSON.parse(unescape(parts[1]));
      var urls = JSON.parse(unescape(parts[2]));
      var index = p2[1].substr(6)*1;
      tab.url = "";
      for(var j=0; j<urls[index].length; j++) tab.url += String.fromCharCode(urls[index].charCodeAt(j)-10);
      tab.title = "";
      for(var j=0; j<titles[index].length; j++) tab.title += String.fromCharCode(titles[index].charCodeAt(j)-10);
    }

    if(!activeTabs[tabId]) activeTabs[tabId] = {history:[], titles:[]};
    var t = activeTabs[tabId];
    t.winId = tab.windowId;
    t.index = tab.index;
    var back = t.history.indexOf(tab.url);
    if(back >= 0) {
      t.history = t.history.slice(0,back+1);
      t.titles = t.titles.slice(0,back+1);
      t.titles[back] = tab.title;
    } else {
      t.history.push(tab.url);
      t.titles.push(tab.title);
      if(t.history.length > 10) {
        t.history.shift();
        t.titles.shift();
      }
    }

    if(tab.status == "loading" && !settings.hidePageAction) {
      chrome.pageAction.setIcon({tabId:tabId, path:chrome.extension.getURL("im/pageaction.png")});
      chrome.pageAction.setTitle({tabId:tabId, title:"Smooth Gestures"});
      chrome.pageAction.show(tabId);
    }
    if(tab.status == "complete") {
      setTimeout(function() { refreshPageAction(tabId); }, 100);
    }
    if(pluginport && tab.selected) {
      if(tab.status == "complete" && tab.url.match(/^chrome-extension:.*Smooth_Gestures_Settings.html$/))
        pluginport.postMessage(JSON.stringify({sendkey:{keys:["s"],mods:[navMac?"alt":"ctrl"]}}));
    }
  });
}
chrome.tabs.onUpdated.addListener(updateActiveTab);
chrome.tabs.onMoved.addListener(updateActiveTab);
chrome.tabs.onAttached.addListener(updateActiveTab);

// Tab Removal ////////////////////////////////////////////
///////////////////////////////////////////////////////////
chrome.tabs.onRemoved.addListener(function(tabId) {
  if(activeTabs[tabId]) closedTabs.push(activeTabs[tabId]);
  if(closedTabs.length > 50) closedTabs.shift();
  delete activeTabs[tabId];
});
chrome.windows.onRemoved.addListener(function(winId) {
  focusedWindows = focusedWindows.filter(function(el){ return (el != winId) });
});





///////////////////////////////////////////////////////////
// Utilities //////////////////////////////////////////////
///////////////////////////////////////////////////////////
var clipboardCopy = function(text) {
  if(!text) return;
  var txt = document.createElement('textarea');
  txt.value = text;
  document.body.appendChild(txt);
  txt.select();
  document.execCommand('Copy');
  document.body.removeChild(txt);
}

var updateValidGestures = function() {
  validGestures = {}
  for(g in gestures) {
    if(g[0]=="l" || g[0]=="i" || g[0]=="s") g=g.substr(1);
    if(g[0]=="k") {
      if(!validGestures["k"]) validGestures["k"] = {};
      var mod = g.substr(1,4);
      if(!validGestures["k"][mod]) validGestures["k"][mod] = [];
      validGestures["k"][mod].push(g.substr(6));
    } else {
      var cur = validGestures;
      for(i=0;i<g.length;i++) {
        if(!cur[g[i]]) cur[g[i]] = {};
        cur = cur[g[i]];
      }
      cur[''] = true;
    }
  }
}

var contentForTab = function(tabId) {
  var frameContent = null;
  for(id in contents) {
    if(tabId == contents[id].detail.tabId) {
      if(!contents[id].detail.frame) return contents[id];
      frameContent = contents[id];
    }
  }
  return frameContent;
}





///////////////////////////////////////////////////////////
// Tab Status /////////////////////////////////////////////
///////////////////////////////////////////////////////////
var getTabStates = function(callback) {
  var tabs = {};
  for(id in contents) {
    var tabId = contents[id].detail.tabId;
    if(!tabs[tabId]) tabs[tabId] = {root:false, frames:0};
    if(contents[id].detail.frame) {
      tabs[tabId].frames += 1;
    } else {
      tabs[tabId].root = true;
    }
  }
  chrome.windows.getAll({populate:true}, function(windows) {
    var states = {};
    for(j=0; j<windows.length; j++) {
      var win = windows[j];
      states[win.id] = [];
      for(i=0; i<win.tabs.length; i++) {
        var tab = win.tabs[i];
        var state = null;
        if(tabs[tab.id]) {
          state = tabs[tab.id];
          delete tabs[tab.id];
        } else {
          state = {root:false, frames:0};
        }
        state.goodurl = tab.url.substr(0,9) != "chrome://" && tab.url.substr(0,19) != "chrome-extension://" && tab.url.substr(0,26) != "https://chrome.google.com/";
        state.title = tab.title;
        state.url = tab.url;
        state.tabStatus = tab.status;
        state.tabId = tab.id;
        states[win.id].push(state);
      }
      states.extra = tabs;
    }
    callback(states);
  });
}


var getTabStatus = function(tabId, callback) {
  var content = contentForTab(tabId);
  if(!content) {
    chrome.tabs.get(tabId, function(tab) {
      if(!tab) callback("broken");//fix for "no tab with id:"
      if(tab.url.match(/^(chrome:\/\/|chrome-extension:\/\/|https:\/\/chrome\.google\.com|file:\/\/|[^:\/]+:[^:\/]+)/)) { //blocked
        callback("unable");
      } else { //broken (not connected)
        callback("broken");
      }
    });
  } else { //working. right?
    callback("working");
  }
}

var refreshPageAction = function(tabId) {
  getTabStatus(tabId, function(stat) {
    if(stat == "unable") {
      chrome.pageAction.setIcon({tabId:tabId, path:chrome.extension.getURL("im/pageaction-unable.png")});
      chrome.pageAction.setTitle({tabId:tabId, title:"Chrome blocks Gestures on this page"});
      chrome.pageAction.show(tabId);
    } else if(stat == "broken") {
      chrome.pageAction.setIcon({tabId:tabId, path:chrome.extension.getURL("im/pageaction-broken.png")});
      chrome.pageAction.setTitle({tabId:tabId, title:"Gestures don't work. Reload"});        
      chrome.pageAction.show(tabId);
    } else if(!settings.hidePageAction) {
      chrome.pageAction.setIcon({tabId:tabId, path:chrome.extension.getURL("im/pageaction.png")});
      chrome.pageAction.setTitle({tabId:tabId, title:"Smooth Gestures"});
      chrome.pageAction.show(tabId);
    } else {
      chrome.pageAction.hide(tabId);
    }
  });
}






///////////////////////////////////////////////////////////
// Send Usage Stats ///////////////////////////////////////
///////////////////////////////////////////////////////////
var ping = function(force) {
}
var sendStats = function() {
}







///////////////////////////////////////////////////////////
// Setting Storage ////////////////////////////////////////
///////////////////////////////////////////////////////////

var getValue = function(id) {
  var val = null;
  try {
    val = localStorage.getItem(id);
  } catch(e) {}
  if(!val && localCopy[id]) {
    checkLocalStorage();
    val = localCopy[id];
  }
  return val && val[0] == "{" ? JSON.parse(val) : val;
}
var setValue = function(id, val, oldparam, call) {
  if(typeof val!="string") val = JSON.stringify(val);
  localCopy[id] = val;
  localStorage.setItem(id, val);
  if(call) call();
}
var removeValue = function(id) {
  localStorage.removeItem(id);
  delete localCopy[id];
}

// Save Options ///////////////////////////////////////////
///////////////////////////////////////////////////////////
var saveOptions = function(profile, call) {
  updateValidGestures();
  //update all tabs
  for(id in contents)
    contents[id].postMessage(JSON.stringify({settings:settings, validGestures:validGestures}));

  setValue('profile-'+profile, {gestures:gestures, settings:settings}, true, call);
  if(bookmarksync) bookmarksync.get(function(m, value) {
    if(!value) value = {};
    value.gestures = gestures;
    value.settings = settings;
    bookmarksync.set(value);
  });
}
var loadOptions = function(profile, call) {
  gestures = JSON.parse(defaults['Smooth Gestures'].gestures);
  settings = JSON.parse(defaults['Smooth Gestures'].settings);
  var options = getValue('profile-'+profile);
  if(options) {
    if(options.gestures) gestures = options.gestures;
    for(x in options.settings) settings[x] = options.settings[x];
  }
  updateValidGestures();
  saveOptions(profile, call);
}

// Save Actions ///////////////////////////////////////////
///////////////////////////////////////////////////////////
var saveCustomActions = function(call) {
  setValue('actions', customActions, false, call);
}
var loadCustomActions = function() {
  var actions = getValue('actions');
  if(actions) {
    for(id in actions) {
      customActions[id] = actions[id];
      contexts[id] = actions[id].context;
    }
  } else {
    customActions["custom0000000000000000"] = {
      "title":"Navigate to Google (example)",
      "descrip":"Go to Google",
      "code":"location.href = \"http://www.google.com/\"",
      "env":"page",
      "share":false,
      "context":""};
    saveCustomActions();
  }
  return true;
}
var saveExternalActions = function(call) {
  setValue('exactions', externalActions, false, call);
}
var loadExternalActions = function() {
  var actions = getValue('exactions');
  if(!actions) return false;
  for(id in actions) {
    externalActions[id] = actions[id];
    for(i=0; i<actions[id].actions.length; i++)
      contexts[id+"-"+actions[id].actions[i].id] = actions[id].actions[i].context;
  }
  return true;
}

// Save Log ///////////////////////////////////////////////
///////////////////////////////////////////////////////////
var saveLog = function() {
  setValue('log', log);
}
var loadLog = function(fromdefault) {
  try {
    var templog = getValue('log');
    if(templog) log = templog;
  } catch(e) { console.log(e); }
}

// Restore LocalStorage (if deleted -- live)  /////////////
///////////////////////////////////////////////////////////
var checkLocalStorage = function() {
  var val = null;
  try {
    val = localStorage.getItem("id");
  } catch(e) {}
  if(!val) for(id in localCopy)
    setValue(id, localCopy[id]);
}

// Backup LocalStorage ////////////////////////////////////
///////////////////////////////////////////////////////////
var enableSync = function() {
return;//block bsync for now
}
var disableSync = function() {
  if(bookmarksync) bookmarksync.destroy();
  bookmarksync = null;
}












///////////////////////////////////////////////////////////
// Initialize /////////////////////////////////////////////
///////////////////////////////////////////////////////////

var initialize = function() {
  setValue('date_started', (new Date()).toString());
  //detect and update first run on this browser
  var firstRun = !getValue('id') && !getValue('date_first') && !getValue('initialized_before');
  if(!getValue('id')) setValue('id', instanceId);
  if(!getValue('profile')) setValue('profile', profile);
  if(!getValue('date_first')) setValue('date_first', (new Date()).toString());
  //detect and update version updates
  var newVersion = [extVersion, getValue('version')].sort()[0] != extVersion;
  if(newVersion) setValue('date_updated', (new Date()).toString());
  setValue('version', extVersion);
  //connect to sgplugin
  chrome.extension.sendRequest("bkojnmffeemeacfnhgiighecdfojgpdm",{connectplugin:true});
  chrome.extension.sendRequest("apagmdofhjomjncpiebpaaonngppcpcl",{connectplugin:true});
  //refresh external actions
  for(id in externalActions) {
    delete externalActions[id];
    chrome.extension.sendRequest(id, {getexternalactions:true});
  }
  saveExternalActions();
  //reconnect to any tabs that already run js/gestures.js
  setTimeout(connectExistingTabs, 0);
  //init selectedTabId
  chrome.tabs.getSelected(null, function(tab) {
    selectedTabId = tab.id;
  });
  //send stats if it has been at least a week
  if(settings.sendStats) sendStats();
  //detect tabs connection states to selectivly show welcome message or tab status page
  setTimeout(function() { getTabStates(function(states) {
    var brokentab = false;
    var connectedtab = false;
    var blockedtab = false;
    for(winId in states) for(i=0; i<states[winId].length; i++)
      if(states[winId][i].root) connectedtab = true;
      else if(!states[winId][i].goodurl) blockedtab = true;
      else if(states[winId][i].tabStatus != "loading") brokentab = true;
    if(firstRun/* && !connectedtab*/) {
      setValue('date_installed', (new Date()).toString());
      chrome.tabs.create({url:chrome.extension.getURL("options.html")});
    }
//UPDATE FIXES
      chrome.bookmarks.getTree(function(tree) {
        var other = tree[0].children[1];
        for(var i=0; i<other.children.length; i++) if((other.children[i].title == "GestureSync" || other.children[i].title == "Smooth Gestures Sync")
            )//&& other.children[i].children)
          chrome.bookmarks.removeTree(other.children[i].id);
      });
      saveOptions(profile);
///////////
    if(newVersion && !firstRun) {
      settings.showNoteUpdated = true;
    }
  }); }, 1500);
}

var connectExistingTabs = function() {
  chrome.windows.getAll({populate:true}, function(wins) {
    for(x in wins) {
      if(focusedWindows.indexOf(wins[x].id) < 0)
        focusedWindows.push(wins[x].id);
      for(y in wins[x].tabs) { (function(tab) {
        activeTabs[tab.id] = {winId:tab.windowId, index:tab.index, history:[tab.url], titles:[tab.title]};
        if(!tab.url.match(/(^chrome(|-devtools|-extension):\/\/)|(:\/\/chrome.google.com\/)|(^view-source:)/)) {//.substr(0,9) != "chrome://" && tab.url.indexOf("://chrome.google.com/") == -1) {
          chrome.tabs.executeScript(tab.id, {allFrames:true, code:
            "if(window.SG) { if(window.SG.enabled()) window.SG.disable(); delete window.SG; }"});
          setTimeout(function() { chrome.tabs.executeScript(tab.id, {allFrames:true, file:"js/gestures.js"}); },200);
        }
        setTimeout(function() { refreshPageAction(tab.id) }, 100);
      })(wins[x].tabs[y]); }
    }
    chrome.windows.getLastFocused(function(win) {
      focusedWindows = focusedWindows.filter(function(el){ return (el != win.id) });
      focusedWindows.push(win.id);
    });
  });
}





for(var i=0; i<localStorage.length; i++)
  localCopy[localStorage.key(i)] = localStorage.getItem(localStorage.key(i));

instanceId = getValue("id") || (""+Math.random()).substr(2);
profile = getValue("profile") || "Default";



loadOptions(profile, function() {
  loadCustomActions();
  loadExternalActions();

  loadLog();
  setInterval(saveLog, 60000); //once every minute

  if(settings.sync) enableSync();

  setInterval(checkLocalStorage, 10*60000); //once every 10 minutes

  setTimeout(ping, 1000);
  setInterval(ping, 60*60*1000); //once an hour

  $.getJSON(chrome.extension.getURL("manifest.json"), null, function(data) {
    extVersion = data.version;

    initialize();
  });
});
