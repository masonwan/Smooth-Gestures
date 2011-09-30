
var reloadPage = function() {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.update(tab.id, {url:tab.url});
    window.close();
  });
}

var bg = chrome.extension.getBackgroundPage();

if(bg.popupMessage == "updated") {
  $("body").append($('<p>').text(chrome.i18n.getMessage('popup_updated', bg.extVersion)))
  bg.popupMessage == null;
} else {
  chrome.tabs.getSelected(null, function(tab) {
    bg.getTabStatus(tab.id, function(stat) {
      if(stat == "broken") {
        $("body").append("<div id=statuslight class=red>").append($("<h1>").text(chrome.i18n.getMessage('popup_status_broken_short')))
                 .append($('<p>').text(chrome.i18n.getMessage('popup_status_broken')))
                 .append($('<div class=sgbutton>').text(chrome.i18n.getMessage('popup_button_options')).css({"float":"right"}).click(function(){chrome.tabs.create({"url":"options.html"});window.close();}))
                 .append($('<div class=sgbutton>').text(chrome.i18n.getMessage('popup_button_reload')).css({"float":"left"}).click(reloadPage))
      } else if(stat == "unable") {
        $("body").append("<div id=statuslight class=yellow>").append($("<h1>").text(chrome.i18n.getMessage('popup_status_unable_short')))
                 .append($('<p>').text(chrome.i18n.getMessage('popup_status_blocked_1')))
        if(tab.url == "chrome://newtab/")
          $("body").append($('<p>').html(chrome.i18n.getMessage('popup_status_blocked_newtab2', ["<a href='https://chrome.google.com/webstore/detail/djnmanljkopakfofdpmelbccmbpbocaa' target='_blank'>"+chrome.i18n.getMessage('popup_status_blocked_newtab2_link')+"</a>"])));
        if(tab.url.match(/^file:\/\//))
          $("body").append($('<p>').html(chrome.i18n.getMessage('popup_status_blocked_file2', '<a href="chrome://extensions/" target="_blank">'+chrome.i18n.getMessage('popup_status_blocked_file2_link')+'</a>')));
        $("body").append($('<div class=sgbutton>').text(chrome.i18n.getMessage('popup_button_options')).css({"float":"right"}).click(function(){chrome.tabs.create({"url":"options.html"});window.close();}))
      } else {
        $("body").append("<div id=statuslight class=green>").append($("<h1>").text(chrome.i18n.getMessage('popup_status_working_short')))
                 .append($('<p>').text(chrome.i18n.getMessage('popup_status_working')))
                 .append($('<div class=sgbutton>').text(chrome.i18n.getMessage('popup_button_options')).css({"float":"right"}).click(function(){chrome.tabs.create({"url":"options.html"});window.close();}))
                 .append($('<div class=sgbutton>').text(chrome.i18n.getMessage('popup_button_hidepageaction')).css({"float":"left"}).click(function(){
                    bg.settings.hidePageAction = true;
                    bg.saveOptions(bg.profile);
                    chrome.windows.getAll({populate:true}, function(wins) {
                      for(i in wins) for(j in wins[i].tabs) bg.refreshPageAction(wins[i].tabs[j].id);
                    });
                    window.close();}))
      }
    });
  });
}

