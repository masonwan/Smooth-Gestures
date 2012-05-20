

document.title = chrome.i18n.getMessage("name")+': '+chrome.i18n.getMessage("status_title");
$("body").append($('<h1 id="optionstitle"><img src="im/icon48.png"/> '+chrome.i18n.getMessage("name")+': '+chrome.i18n.getMessage("status_title")+'</h1>'))
         .append('<div id=optionslink><a href="options.html">'+chrome.i18n.getMessage("status_link_options")+'</a></div>')
         .append('<div id=legend><input class="reloadall" type="button" value="'+chrome.i18n.getMessage("status_button_reloadall")+'"><div id="lred">'+chrome.i18n.getMessage("status_legend_broken")+'</div><div id="lgray">'+chrome.i18n.getMessage("status_legend_blocked")+'</div><div id="lyellow">'+chrome.i18n.getMessage("status_legend_loading")+'</div><div id="lgreen">'+chrome.i18n.getMessage("status_legend_working")+'</div><span class=clearall></span></div>')
         .append('<div id=tabstates>')




var states = null;

var getStates = function() {
  chrome.extension.sendRequest({getstates:true}, function(resp) {
    resp = JSON.parse(resp);
    if(!resp.states) return;
    states = resp.states;
    chrome.windows.getCurrent(function(win) {
      $("#tabstates").empty()
      generateSet(states[win.id], chrome.i18n.getMessage("status_window_this"));
      for(id in states) if(id != win.id && id != "extra") {
        generateSet(states[id], chrome.i18n.getMessage("status_window_other"));
      }
      if(states.extra.length > 0) {
        generateSet(states.extra, "EXTRA (LEAKING)");
      }
    });
  });
}

var reloadTab = function(tabId) {
  chrome.extension.sendRequest({reloadtab:tabId});
}

getStates();
setInterval(getStates, 2000);


var generateSet = function(tstates, headline) {
  $("#tabstates").append($("<div class=title>").text(headline));
  for(i=0; i<tstates.length; i++) {
    generateTab(tstates[i]);
  }
}
var generateTab = function(state, length) {
  var tab = $("<div class=tabstatus>");
  tab.text((state.frames>0?"["+state.frames+"] ":"")+(state.title ? state.title : "..."));
  if(state.root)
    tab.css({"background-color":"#aaeeaa"});
  else if(state.tabStatus == "loading")
    tab.text("...").css({"background-color":"#eeeeaa"});
  else if(!state.goodurl)
    tab.css({"background-color":"#cccccc"});
  else
    tab.css({"background-color":"#eeaaaa"}).prepend($("<input type='button' value='"+chrome.i18n.getMessage("status_button_reloadone")+"' class='reloadone'>").click(function() {
      reloadTab(state.tabId);
      $(this).css({"display":"none"});
      tab.css({"background-color":"#eeeeaa"});
    }));
  $("#tabstates").append(tab);
}

var reloadall = function() {
  for(id in states) for(i=0; i<states[id].length; i++)
    if(states[id][i].title && !states[id][i].root && states[id][i].goodurl)
      reloadTab(states[id][i].tabId);
  setTimeout(getStates, 100);
}


$(".reloadall").click(reloadall);

