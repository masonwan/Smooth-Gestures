

var scrollto = function(name) {
  var destination = $("a[name="+name+"]").offset().top-80;
  $("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination}, 500, "swing");
}
var getText = function(name, param) {
  if(name.substr(0,13) == "action_custom") {
    var parts = name.split("_");
    if(bg.customActions[parts[1]])
      return bg.customActions[parts[1]][parts.length==3 ? "descrip" : "title"];
    else
      return "[deleted action]";
  }
  return chrome.i18n.getMessage(name.replace(/-/g,"_"), param);
}

var bg = chrome.extension.getBackgroundPage();
var optionsUpdated = function(blockGenerate) {
  bg.saveOptions(bg.profile);
  //refresh page
  if(!blockGenerate) generateOptions();
}




document.title = getText("name")+': '+getText("options_title");
$("body").append($('<div>').attr('id','contents-contain').append($('<div>').attr('id','contents')
                 .append($('<div>').attr('class','title').text(getText("options_contents_actions")))
                 .append($('<div>').attr('id','contentsactions'))
                 .append($('<div>').attr('class','title').text(getText("options_contents_settings")))
                 .append($('<div>').attr('id','contentssettings'))
                 .append($("<ul>")
                   .append($('<li id="translatemess">Help <a id="translatelink" href="translate.html">Translate SG</a></li>'))
                   .append($('<li id="supportmess">Find a bug? <a id="supportlink" href="http://code.google.com/p/smoothgestures-chromium/issues/list">Report it</a></li>')))))
         .append($('<h1 id="optionstitle"><img src="im/icon48.png"/> '+getText("name")+': '+getText("options_title")+'</h1>'))
         .append($('<div>').attr('id','addgesture')
           .append($("<div>").attr("id","addgesturebutton").html("<span>+</span> "+chrome.i18n.getMessage("options_button_startaddgesture")).attr("tabindex",0).click(function() {addGesture(null);})))

if(bg.settings.sendStats == undefined)
  $("#optionstitle").after($('<div>').attr('id','note_sendStats').attr('class','note green')
    .append($('<div>').attr("class", 'close').attr("tabindex",0).html('&times;').click(function() {
      $("#note_sendStats").remove();
      bg.settings.sendStats = false;
      refreshSendStats();
      updateSendStats(); }))
    .append($("<input>").attr("type", "button").val(getText("setting_sendstats")).css({"min-width":"5em", "font-weight":"bold", "float":"right", "margin-right":".5em"}).click(function() {
      $("#note_sendStats").remove();
      bg.settings.sendStats = true;
      refreshSendStats();
      updateSendStats(); }))
    .append($('<p>').text(getText("setting_sendstats_descrip")))
    .append($("<div>").attr("class", "clearall")))

if(bg.settings.hidePageAction == undefined)
  $("#optionstitle").after($('<div>').attr('id','note_hidePageAction').attr('class','note green')
    .append($('<div>').attr("class", 'close').attr("tabindex",0).html('&times;').click(function() {
      $("#note_hidePageAction").remove();
      bg.settings.hidePageAction = false;
      refreshHidePageAction();
      updateHidePageAction(); }))
	.append($("<input>").attr("type", "button").val(getText("options_note_hidepageaction_button")).css({"min-width":"5em", "font-weight":"bold", "float":"right", "margin-right":".5em"}).click(function() {
      $("#note_hidePageAction").remove();
      bg.settings.hidePageAction = true;
      refreshHidePageAction();
      updateHidePageAction(); }))
    .append($('<p>').text(getText("setting_hidepageaction_descrip")))
    .append($("<div>").attr("class", "clearall")))

if(!bg.settings.hideNoteTranslate && ['en', 'en-US', 'en-GB'].indexOf(navigator.language) == -1)
  $("#optionstitle").after($('<div>').attr('id','note_translate').attr('class','note green')
    .append($('<div>').attr("class", 'close').attr("tabindex",0).html('&times;').click(function() {
      $("#note_translate").remove();
      bg.settings.hideNoteTranslate = true;
      bg.saveOptions(bg.profile); }))
    .append($('<p>').html(getText("options_note_translate", "<a href='/translate.html'>"+getText("options_note_translate_link")+"</a>")))
    .append($("<div>").attr("class", "clearall")))

if(!bg.settings.hideNotePrint)
  $("#optionstitle").after($('<div>').attr('id','note_print').attr('class','note green')
    .append($('<div>').attr("class", 'close').attr("tabindex",0).html('&times;').click(function() {
      $("#note_print").remove();
      bg.settings.hideNotePrint = true;
      bg.saveOptions(bg.profile); }))
    .append($("<input>").attr("type", "button").val(getText("options_note_print_button")).css({"min-width":"5em", "font-weight":"bold", "float":"right", "margin-right":".5em"}).click(function() {
      window.print(); }))
    .append($('<p>').text(getText("options_note_print")))
    .append($("<div>").attr("class", "clearall")))

if(!bg.settings.hideNoteWelcome)
  $("#optionstitle").after($('<div>').attr('id','note_welcome').attr('class','note clear')
    .append($('<div>').attr("class", 'close').attr("tabindex",0).html('&times;').click(function() {
      $("#note_welcome").remove();
      bg.settings.hideNoteWelcome = true;
      bg.saveOptions(bg.profile); }))
    .append($('<p>').text(getText("options_welcome_0")).css({"margin":"0 0 .7em", "font-weight":"bold"}))
    .append($('<ul>').css({"margin":"0"})
      .append($('<li>').text(getText("options_welcome_1")).css({"margin-bottom":".7em"}))
      .append($('<li>').text(getText("options_welcome_2")).css({"margin-bottom":".7em"}))
      .append($('<li>').text(getText("options_welcome_3")).css({"margin-bottom":".7em"})))
    .append($("<div>").attr("class", "clearall")))

if(!bg.settings.hideNoteRemindRate/* && new Date() - new Date(bg.getValue('date_first')) > 30*24*60*60*1000*/) {
  $("#optionstitle").after($('<div>').attr('id','note_remindrate').attr('class','note green')
    .append($('<div>').attr("class", 'close').attr("tabindex",0).html('&times;').click(function() {
      $("#note_remindrate").remove();
      bg.settings.hideNoteRemindRate = true;
      bg.saveOptions(bg.profile); }))
    .append($('<p>').html(getText("options_note_remindrate", "<a href='https://chrome.google.com/webstore/detail/lfkgmnnajiljnolcgolmmgnecgldgeld'>"+getText("options_note_remindrate_link")+"</a>")))
    .append($("<div>").attr("class", "clearall")))
}

if(bg.settings.showNoteUpdated) {
  $("#optionstitle").after($('<div>').attr('id','note_updated').attr('class','note green')
    .append($('<div>').attr("class", 'close').attr("tabindex",0).html('&times;').click(function() {
      $("#note_updated").remove(); }))
    .append($('<p>').text(getText("options_note_updated", bg.extVersion)))
    .append($("<div>").attr("class", "clearall")))
  bg.settings.showNoteUpdated = false;
  bg.saveOptions(bg.profile);
}










var generateOptions = function() {
  $("#alloptions, #contentsactions *, #contentssettings *").remove();
  var root = $("<div>").attr("id", 'alloptions');

  for(cat in bg.categories) root.append(generateTable(cat));
  root.appendTo("body");
  for(gesture in bg.gestures) displayGesture(gesture);

  root.append($("<div>").attr("class", "footer")
              .text("You have gestured approximately "+(""+((bg.log.line?bg.log.line.distance:0)*.000254)).substr(0,8)+" meters."));

  refreshNewTabUrl();
  refreshNewTabRight();
  refreshNewTabLinkRight();
  refreshTrailBlock();
  refreshTrailColor();
  refreshTrailWidth();
  refreshHoldButton();
  refreshCloseLastBlock();
  refreshSelectToLink();
  refreshSendStats();
  refreshHidePageAction();
  refreshMarketingAction();
  refreshContextOnLink();
  refreshBlacklist();
}
var generateTable = function(cat) {
  var table = $("<div>").attr("class", 'optiontable').attr("id", cat)
                        .append($("<a>").attr("name",cat))
                        .append($("<div>").attr("class", 'tabletitle').text(getText(cat)));
  if(bg.categories[cat].actions) {
    $("#contentsactions").append($("<div>").append($("<a href='#'>").click(function() { scrollto(cat); return false; }).text(getText(cat))));
    var empty = $("<div>");
    for(i=0; i<bg.categories[cat].actions.length; i++) {
      var t = empty;
      for(g in bg.gestures) if(bg.gestures[g] == bg.categories[cat].actions[i]) { t = table; break; }
      t.append(generateGRow(bg.categories[cat].actions[i]));
    }
    if(empty.children().length > 0) table.append(actionGroup(chrome.i18n.getMessage("options_moreactions")+" ("+empty.children().length+")", "empty-"+cat, false, empty));
  } else if(bg.categories[cat].customActions) {
    $("#contentsactions").append($("<div>").append($("<a href='#'>").click(function() { scrollto(cat); return false; }).text(getText(cat))));
    $(".tabletitle", table).append($("<div>").attr("id","addactionbutton").html("<span>+</span> "+chrome.i18n.getMessage("options_button_addcustomaction")).attr("tabindex",0).click(function() {addCustom();}))
    for(id in bg.customActions) {
      table.append(generateCustomRow(id));
    }
  } else if(bg.categories[cat].externalActions) {
    var num = 0;
    table = $("<div>").attr("class", 'optiontable')
                      .append($("<a>").attr("name",cat));
    for(id in bg.externalActions) {
      table.append($("<div>").attr("class", 'tabletitle').text(bg.externalActions[id].name));
      var actions = bg.externalActions[id].actions;
      for(i=0; i<actions.length; i++) {
        table.append(generateExternalRow(id+"-"+actions[i].id, actions[i].title, actions[i].descrip));
      }
      num++;
    }
    if(num == 0) return null;
    else $("#contentsactions").append($("<div>").append($("<a href='#'>").click(function() { scrollto(cat); return false; }).text(chrome.i18n.getMessage("options_externalactions"))));
  } else if(bg.categories[cat].settings) {
    $("#contentssettings").append($("<div>").append($("<a href='#'>").click(function() { scrollto(cat); return false; }).text(getText(cat))));
    table.append(settingsGroup(getText("setting_group_newtab"), "showNewTabSettings", $("<div>")
           .append(rowNewTabUrl())
           .append(rowNewTabRight())
           .append(rowNewTabLinkRight())))
         .append(settingsGroup(getText("setting_group_trail"), "showTrailSettings", $("<div>")
           .append(rowTrailBlock())
           .append(rowTrailColor())
           .append(rowTrailWidth())))
         .append(settingsGroup(getText("setting_group_context"), "showContextSettings", $("<div>")
           .append(rowContextOnLink())))
         .append(settingsGroup(getText("setting_group_assorted"), "showAssortedSettings", $("<div>")
           .append(rowCloseLastBlock())
           .append(rowSelectToLink())
           .append(rowBlacklist())))
         .append(rowHidePageAction())
         .append(rowMarketingAction())
         .append(rowSendStats())
         .append(rowHoldButton())
         .append(rowReset())
         .append(rowImport())
  }
  return table;
}
var actionGroup = function(title, label, show, rows) {
  return $("<div>").attr("class", "rowgroup")
         .append($("<div>").attr("class", "actiongrouptitle").text(title)
                 .append($("<a>").attr("href","#").text(!bg.settings['hide-'+label]?getText("setting_group_hide"):getText("setting_group_show")).click(function() {
                   if(!bg.settings['hide-'+label]) {
                     $(this).text(getText("setting_group_show"));
                     $("#"+label+"Group").animate({"height":"hide","opacity":0}, 200);
                     bg.settings['hide-'+label] = true;
                     bg.saveOptions(bg.profile);
                   } else {
                     $(this).text(getText("setting_group_hide"));
                     $("#"+label+"Group").animate({"height":"show","opacity":1}, 200)
                     bg.settings['hide-'+label] = false;
                     bg.saveOptions(bg.profile);
                   }
                   return false;
                 })))
         .append(rows.attr("id",label+"Group").attr("class", "grouprows").css({"display":(!bg.settings['hide-'+label]?"block":"none")}))
} 
var generateGRow = function(action) {
  return $("<div>").attr("class", 'actionrow')
         .append($("<div>").attr("id", 'action-'+action).attr("class", "gestureset"))
         .append($("<div>").attr("class", "gesture-add").attr("tabindex",0).text("+").click(function() {addGesture(action)}))
         .append(bg.contexts[action]?$("<img>").attr("class", "actioncontext").attr("src", "im/icon-"+(bg.contexts[action]=="l"?"link":(bg.contexts[action]=="i"?"image":(bg.contexts[action]=="s"?"selection":"")))+".png"):null)
         .append($("<div>").attr("class", "actiontitle").text(getText('action_'+action)))
         .append($("<div>").attr("class", "actiondescrip").text(getText('descrip_'+action)))
         .append($("<div>").attr("class", "clearall"));
}
var generateExternalRow = function(action, title, descrip) {
  return $("<div>").attr("class", 'actionrow')
         .append($("<div>").attr("id", 'action-'+action).attr("class", "gestureset"))
         .append($("<div>").attr("class", "gesture-add").attr("tabindex",0).text("+").click(function() {addGesture(action)}))
         .append($("<div>").attr("class", "actiontitle").text(title))
         .append($("<div>").attr("class", "actiondescrip").text(descrip))
         .append($("<div>").attr("class", "clearall"));
}




var generateCustomRow = function(id) {
  return $("<div>").attr("class", 'actionrow')
         .append($("<div>").attr("id", 'action-'+id).attr("class", "gestureset"))
         .append($("<div>").attr("class", "gesture-add").attr("tabindex",0).text("+").click(function() {addGesture(id)}))
         .append($("<div>").attr("class", "actiontitle").text(bg.customActions[id].title)
                 .append($("<span>").attr("class", "editcustom").attr("tabindex",0).text("edit").click(function() { editCustom(id) }))
                 .append($("<span>").attr("class", "delcustom").attr("tabindex",0).html("&times;").click(function() { delCustom(id) })))
         .append($("<div>").attr("class", "actiondescrip").text(bg.customActions[id].descrip))
         .append($("<div>").attr("class", "clearall"));
}
var editCustom = function(id) {
  var a = bg.customActions[id];
  var row = $("#action-"+id).parent().css({"display":"none"});
  var edit = $("<div>").attr("class", "actionrow").attr("id", "edit-"+id)
         .append($("<div>").attr("class", "savecustom").attr("tabindex",0).text("save").click(function() { saveCustom(id); }))
         .append($("<div>").attr("class", "undocustom").attr("tabindex",0).text("cancel").click(function() { edit.remove(); row.css({"display":"block"}); }))
         .append($("<select>").attr("class", "cxtcustom")
           .append($("<option>").text("starting anywhere").val(""))
           .append($("<option>").text(chrome.i18n.getMessage("context_on_link")).val("l"))
           .append($("<option>").text(chrome.i18n.getMessage("context_on_image")).val("i"))
           .append($("<option>").text(chrome.i18n.getMessage("context_with_selection")).val("s")))
         .append($("<select>").attr("class", "envcustom")
           .append($("<option>").text("context").attr("disabled", "disabled"))
           .append($("<option>").text("page").val("page"))
           .append($("<option>").text("extension").val("ext")))
         .append($("<div>").attr("class", "sharecustom")
           .append($("<input type=checkbox>").attr("id", "share-"+id).attr("checked", a.share))
           .append($("<label>").attr("for", "share-"+id).text("share")))
         .append($("<input type=text>").attr("class", "titlecustom").val(a.title))
         .append($("<input type=text>").attr("class", "descripcustom").val(a.descrip))
         .append($("<textarea>").attr("class", "codecustom").text(a.code))
         .insertAfter(row)
  $(".cxtcustom", edit).val(a.context);
  $(".envcustom", edit).val(a.env);
}
var saveCustom = function(id) {
  var a = bg.customActions[id];
  $("#action-"+id).parent().css({"display":"block"});
  var edit = $("#edit-"+id);
  a.title = $(".titlecustom", edit).val();
  a.descrip = $(".descripcustom", edit).val();
  a.code = $(".codecustom", edit).val();
  a.env = $(".envcustom", edit).val();
  a.share = $("#share-"+id, edit).is(":checked");
  a.context = $(".cxtcustom", edit).val();
  bg.contexts[id] = a.context;

  bg.saveOptions(bg.profile);
  bg.saveCustomActions();
  generateOptions();
}
var addCustom = function() {
  var id = "custom"+(""+Math.random()).substr(2);
  bg.customActions[id] = {};
  var a = bg.customActions[id];
  a.title = "Navigate to Page";
  a.descrip = "Go to Google";
  a.code = "location.href = \"http://www.google.com\";";
  a.env = "page";
  a.share = true;
  a.context = "";
  bg.contexts[id] = a.context;

  bg.saveOptions(bg.profile);
  bg.saveCustomActions();
  generateOptions();
  editCustom(id);
}
var delCustom = function(id) {
  if(!confirm("Delete this custom action?")) return;

  for(g in bg.gestures) if(bg.gestures[g] == id) removeGesture(g);

  delete bg.customActions[id];
  delete bg.contexts[id];

  bg.saveOptions(bg.profile);
  bg.saveCustomActions();
  generateOptions();
}




var settingsGroup = function(title, label, rows) {
  return $("<div>").attr("class", "rowgroup")
         .append($("<div>").attr("class", "settinggrouptitle").text(title)
                 .append($("<a>").attr("href","#").text(bg.settings[label]?getText("setting_group_hide"):getText("setting_group_show")).click(function() {
                   if(bg.settings[label]) {
                     bg.settings[label] = false;
                     $(this).text(getText("setting_group_show"));
                     $("#"+label+"Group").animate({"height":"hide","opacity":0}, 200);
                     bg.saveOptions(bg.profile);
                   } else {
                     bg.settings[label] = true;
                     $(this).text(getText("setting_group_hide"));
                     $("#"+label+"Group").animate({"height":"show","opacity":1}, 200);
                   }
                   return false;
                 })))
         .append(rows.attr("id",label+"Group").attr("class", "grouprows").css({"display":(bg.settings[label]?"block":"none")}))
}


var rowReset = function() {
  return $('<div>').attr('class', "settingrow")
         .append($("<div>").attr("class", "settingcontrol")
                 .append($("<input>").attr("type", "button").val(getText("setting_button_reset")).css({'min-width':'5em', 'font-weight':'bold'}).click(doReset)))
         .append($("<div>").attr("class", "settingtitle").text(getText("setting_reset")))
         .append($("<div>").attr("class", "settingdescrip").text(getText("setting_reset_descrip")))
}
var doReset = function() {
  if(confirm(getText("setting_warning_reset"))) {
    bg.gestures = JSON.parse(bg.defaults['Smooth Gestures'].gestures);
    optionsUpdated();
  }
}

var rowImport = function() {
  return $('<div>').attr('class', "settingrow")
         .append($("<div>").attr("class", "settingcontrol")
                 .append($("<div>").attr("class", "filespoof")
                   .append($("<input>").attr("type", "file").change(doImport))
                   .append($("<input>").attr("type", "button").attr("tabindex",-1).val(getText("setting_button_import")))))
         .append($("<div>").attr("class", "settingcontrol")
                 .append($("<input>").attr("type", "button").val(getText("setting_button_export")).css({'min-width':'5em', 'font-weight':'bold'}).click(function(t) {chrome.tabs.create({url:"Smooth_Gestures_Settings.html"});})))
         .append($("<div>").attr("class", "settingtitle").text(getText("setting_import")))
         .append($("<div>").attr("class", "settingdescrip").text(getText("setting_import_descrip")))
}
var htmlDecode = function(input) {
  var e = document.createElement('div');
  e.innerHTML = input.replace(/</g, "[leftangle]");
  return e.childNodes[0].nodeValue.replace(/\[leftangle\]/g, "<");
}
var doImport = function() {
  var finput = this;
  if(this.files.length <= 0) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var res = reader.result;
    res = res.substring(res.indexOf("{"),res.lastIndexOf("}")+1);
alert(res)
alert(htmlDecode(res));
    res = htmlDecode(res);
    var importJSON = JSON.parse(res);
    finput.value = "";
    if(importJSON.title != "Smooth Gestures Settings") { alert("Error Importing Settings"); return; }
    if(importJSON.gestures) bg.gestures = importJSON.gestures;
    for(x in importJSON.settings) bg.settings[x] = importJSON.settings[x];
    for(x in importJSON.customActions) bg.customActions[x] = importJSON.customActions[x];
    optionsUpdated();
  }
  reader.readAsText(this.files[0]);
}

var rowContextOnLink = function() {
  return $('<div>').attr("class", "settingrow")
         .append($("<div>").attr("class", "settingcontrol")
                 .append($("<select>").attr("id", "contextOnLink")
                         .change(updateContextOnLink)
                         .append($("<option>").val("1").text(getText("setting_button_on")))
                         .append($("<option>").val("0").text(getText("setting_button_off")))))
         .append($("<div>").attr("class", "settingtitle").text(getText("setting_force_context")))
         .append($("<div>").attr("class", "settingdescrip").text(getText("setting_force_context_descrip")))
}
var updateContextOnLink = function() {
  bg.settings.contextOnLink = ($("#contextOnLink").val() == 1);
  optionsUpdated();
}
var refreshContextOnLink = function() {
  $("#contextOnLink").val(bg.settings.contextOnLink ? 1 : 0);
}

var rowHoldButton = function() {
  return $('<div>').attr("class", "settingrow")
         .append($("<div>").attr("class", "settingcontrol")
                 .append($("<select>").attr("id", "holdButton")
                         .change(updateHoldButton)
                         .append($("<option>").val("-1").text(getText("setting_disabled")))
                         .append($("<option>").val("0").text(getText("setting_button_left")))
                         .append($("<option>").val("1").text(getText("setting_button_middle")))
                         .append($("<option>").val("2").text(getText("setting_button_right")))))
         .append($("<div>").attr("class", "settingtitle").text(getText("setting_hold_button")))
         .append($("<div>").attr("class", "settingdescrip").text(getText("setting_hold_button_descrip")))
}
var updateHoldButton = function() {
  bg.settings.holdButton = $("#holdButton").val();
  optionsUpdated();
}
var refreshHoldButton = function() {
  $("#holdButton").val(bg.settings.holdButton);
}

var rowTrailColor = function() {
  return $('<div>').attr("class", "settingrow")
         .append($("<div>").attr("class", "settingcontrol")
                 .append($("<div>").attr("id", "trailColor").css({"float":"right", "width":"15px", "height":"140px", "border":"1px solid gray"}))
                 .append($("<div>").css({"width":"200px"}))
                         .append($("<div>").attr("id", "trailColorR").append($("<input>").attr({type:"range", min:0, max: 255, value: bg.settings.trailColor.r}).change(updateTrailColor)))
                         .append($("<div>").attr("id", "trailColorG").append($("<input>").attr({type:"range", min:0, max: 255, value: bg.settings.trailColor.g}).change(updateTrailColor)))
                         .append($("<div>").attr("id", "trailColorB").append($("<input>").attr({type:"range", min:0, max: 255, value: bg.settings.trailColor.b}).change(updateTrailColor)))
                         .append($("<div>").attr("id", "trailColorA").append($("<input>").attr({type:"range", min:0, max: 1, step: .01, value: bg.settings.trailColor.a}).change(updateTrailColor))))
         .append($("<div>").attr("class", "settingtitle").text(getText("setting_trail_color")))
         .append($("<div>").attr("class", "settingdescrip").text(getText("setting_trail_color_descrip")))
         .append($("<div>").attr("class", "clearall"))
}
var updateTrailColor = function() {
  refreshTrailColor();
  if(window.updateOptionsTimeout) clearTimeout(window.updateOptionsTimeout);
  window.updateOptionsTimeout = setTimeout(optionsUpdated, 500);
  optionsUpdated(true);
}
var refreshTrailColor = function() {
  $("#trailColorR, #trailColorG, #trailColorB, #trailColorA").css({"margin":"5px", "width":"169px", /*"border":"2px solid",*/ "border-radius":"6px"}).children().css({"padding":"0", "margin":"1px 6px", "width":"155px"});
  $("#trailColorR").css({"background":"-webkit-linear-gradient(left,rgba(255,0,0,0),rgba(255,0,0,1))"});
  $("#trailColorG").css({"background":"-webkit-linear-gradient(left,rgba(0,255,0,0),rgba(0,255,0,1))"});
  $("#trailColorB").css({"background":"-webkit-linear-gradient(left,rgba(0,0,255,0),rgba(0,0,255,1))"});
  $("#trailColorA").css({"background":"-webkit-linear-gradient(left,rgba(0,0,0,0),rgba(0,0,0,1))"});
  bg.settings.trailColor.r = $("#trailColorR input").val()*1;
  bg.settings.trailColor.g = $("#trailColorG input").val()*1;
  bg.settings.trailColor.b = $("#trailColorB input").val()*1;
  bg.settings.trailColor.a = $("#trailColorA input").val()*1;
  $("#trailColor").css("background-color", "rgba("+bg.settings.trailColor.r+","+bg.settings.trailColor.g+","+bg.settings.trailColor.b+","+bg.settings.trailColor.a+")");
}

var rowNewTabUrl = function() {
  return $('<div>').attr("class", "settingrow")
         .append($("<div>").attr("class", "settingcontrol")
                 .append($("<select>").attr("id", "newTabUrl").change(updateNewTabUrl)
                         .append($("<option>").val("chrome://newtab/").text("New Tab page"))
                         .append($("<option>").val("homepage").text("Home page"))
                         .append($("<option>").val("custom").text("Custom page")))
                 .append($("<input>").attr("id", "newTabUrlCustom").attr("type", "text").css({"width":"160px", "border":"1px solid gray", "margin":"0 .8em"}))
                 .append($("<input>").attr("type", "button").val(getText("setting_button_update")).click(updateNewTabUrl)))
         .append($("<div>").attr("class", "settingtitle").text(getText("setting_newtab_url")))
         .append($("<div>").attr("class", "settingdescrip").text(getText("setting_newtab_url_descrip")))
         .append($("<div>").attr("class", "clearall"))
}
var updateNewTabUrl = function() {
  bg.settings.newTabUrl = $("#newTabUrl").val()!="custom" ? $("#newTabUrl").val() : $("#newTabUrlCustom").val();
  if(!bg.settings.newTabUrl.match(/:/) && bg.settings.newTabUrl.match(/\./)) {
    bg.settings.newTabUrl = "http://"+bg.settings.newTabUrl;
  }
  if(!bg.settings.newTabUrl.match(/:/) && bg.settings.newTabUrl != "homepage") {
    bg.settings.newTabUrl = "http://www.google.com/";
  }
  refreshNewTabUrl();
  optionsUpdated();
}
var refreshNewTabUrl = function() {
  $("#newTabUrl").val(bg.settings.newTabUrl);
  if($("#newTabUrl").val() != bg.settings.newTabUrl) {
    $("#newTabUrl").val("custom");
    $("#newTabUrlCustom").val(bg.settings.newTabUrl);
    $("#newTabUrlCustom, #newTabUrlCustom + input").css({"display":""});
  } else {
    $("#newTabUrlCustom, #newTabUrlCustom + input").css({"display":"none"});
  }
}

var rowNewTabLinkRight = function() {
  return $('<div>').attr("class", "settingrow")
         .append($("<div>").attr("class", "settingcontrol")
                 .append($("<select>").attr("id", "newTabLinkRight")
                         .change(updateNewTabLinkRight)
                         .append($("<option>").val("1").text(getText("setting_button_on")))
                         .append($("<option>").val("0").text(getText("setting_button_off")))))
         .append($("<div>").attr("class", "settingtitle").text(getText("setting_newtab_linkright")))
         .append($("<div>").attr("class", "settingdescrip").text(getText("setting_newtab_linkright_descrip")))
}
var updateNewTabLinkRight = function() {
  bg.settings.newTabLinkRight = ($("#newTabLinkRight").val() == 1);
  optionsUpdated();
}
var refreshNewTabLinkRight = function() {
  $("#newTabLinkRight").val(bg.settings.newTabLinkRight ? 1 : 0);
}

var rowNewTabRight = function() {
  return $('<div>').attr("class", "settingrow")
         .append($("<div>").attr("class", "settingcontrol")
                 .append($("<select>").attr("id", "newTabRight")
                         .change(updateNewTabRight)
                         .append($("<option>").val("1").text(getText("setting_button_on")))
                         .append($("<option>").val("0").text(getText("setting_button_off")))))
         .append($("<div>").attr("class", "settingtitle").text(getText("setting_newtab_right")))
         .append($("<div>").attr("class", "settingdescrip").text(getText("setting_newtab_right_descrip")))
}
var updateNewTabRight = function() {
  bg.settings.newTabRight = ($("#newTabRight").val() == 1);
  optionsUpdated();
}
var refreshNewTabRight = function() {
  $("#newTabRight").val(bg.settings.newTabRight ? 1 : 0);
}

var rowTrailWidth = function() {
  return $('<div>').attr("class", "settingrow")
         .append($("<div>").attr("class", "settingcontrol")
                 .append($("<div>").attr("id", "trailWidthDraw").css({"float":"right", "width":"100px", "height":"140px"}))
                 .append($("<div>").attr("id", "trailWidth").append($("<input>").attr({type:"range", min:.2, max: 4, step:.2, value: bg.settings.trailWidth}).css({"padding":"0", "margin":"0", "width":"155px"}).change(updateTrailWidth))))
         .append($("<div>").attr("class", "settingtitle").text(getText("setting_trail_width")))
         .append($("<div>").attr("class", "settingdescrip").text(getText("setting_trail_width_descrip")))
         .append($("<div>").attr("class", "clearall"))
}
var updateTrailWidth = function() {
  refreshTrailWidth();
  if(window.updateOptionsTimeout) clearTimeout(window.updateOptionsTimeout);
  window.updateOptionsTimeout = setTimeout(optionsUpdated, 500);
  optionsUpdated(true);
}
var refreshTrailWidth = function() {
  bg.settings.trailWidth = $("#trailWidth input").val()*1;
  $("#trailWidthDraw").empty().append(window.SG.drawGesture("URU", 100,140, bg.settings.trailWidth))
}

var rowTrailBlock = function() {
  return $('<div>').attr("class", "settingrow")
         .append($("<div>").attr("class", "settingcontrol")
                 .append($("<select>").attr("id", "trailBlock")
                         .change(updateTrailBlock)
                         .append($("<option>").val("1").text(getText("setting_button_on")))
                         .append($("<option>").val("0").text(getText("setting_button_off")))))
         .append($("<div>").attr("class", "settingtitle").text(getText("setting_trail_draw")))
         .append($("<div>").attr("class", "settingdescrip").text(getText("setting_trail_draw_descrip")))
}
var updateTrailBlock = function() {
  bg.settings.trailBlock = ($("#trailBlock").val() != 1);
  optionsUpdated();
}
var refreshTrailBlock = function() {
  $("#trailBlock").val(bg.settings.trailBlock ? 0 : 1);
}

var rowCloseLastBlock = function() {
  return $('<div>').attr("class", "settingrow")
         .append($("<div>").attr("class", "settingcontrol")
                 .append($("<select>").attr("id", "closeLastBlock")
                         .change(updateCloseLastBlock)
                         .append($("<option>").val("1").text(getText("setting_button_on")))
                         .append($("<option>").val("0").text(getText("setting_button_off")))))
         .append($("<div>").attr("class", "settingtitle").text(getText("setting_closelastblock")))
         .append($("<div>").attr("class", "settingdescrip").text(getText("setting_closelastblock_descrip")))
}
var updateCloseLastBlock = function() {
  bg.settings.closeLastBlock = ($("#closeLastBlock").val() == 1);
  optionsUpdated();
}
var refreshCloseLastBlock = function() {
  $("#closeLastBlock").val(bg.settings.closeLastBlock ? 1 : 0);
}

var rowSelectToLink = function() {
  return $('<div>').attr("class", "settingrow")
         .append($("<div>").attr("class", "settingcontrol")
                 .append($("<select>").attr("id", "selectToLink")
                         .change(updateSelectToLink)
                         .append($("<option>").val("1").text(getText("setting_button_on")))
                         .append($("<option>").val("0").text(getText("setting_button_off")))))
         .append($("<div>").attr("class", "settingtitle").text(getText("setting_selecttolink")))
         .append($("<div>").attr("class", "settingdescrip").text(getText("setting_selecttolink_descrip")))
}
var updateSelectToLink = function() {
  bg.settings.selectToLink = ($("#selectToLink").val() == 1);
  optionsUpdated();
}
var refreshSelectToLink = function() {
  $("#selectToLink").val(bg.settings.selectToLink ? 1 : 0);
}

var rowSendStats = function() {
  return $('<div>').attr("class", "settingrow")
         .append($("<div>").attr("class", "settingcontrol")
                 .append($("<select>").attr("id", "sendStats")
                         .change(updateSendStats)
                         .append($("<option>").val("1").text(getText("setting_button_on")))
                         .append($("<option>").val("0").text(getText("setting_button_off")))))
         .append($("<div>").attr("class", "settingtitle").text(getText("setting_sendstats")))
         .append($("<div>").attr("class", "settingdescrip").text(getText("setting_sendstats_descrip")))
}
var updateSendStats = function() {
  bg.settings.sendStats = ($("#sendStats").val() == 1);
  if(bg.settings.sendStats) bg.sendStats();
  optionsUpdated();
}
var refreshSendStats = function() {
  $("#sendStats").val(bg.settings.sendStats ? 1 : 0);
}

var rowHidePageAction = function() {
  return $('<div>').attr("class", "settingrow")
         .append($("<div>").attr("class", "settingcontrol")
                 .append($("<select>").attr("id", "hidePageAction")
                         .change(updateHidePageAction)
                         .append($("<option>").val("1").text(getText("setting_button_on")))
                         .append($("<option>").val("0").text(getText("setting_button_off")))))
         .append($("<div>").attr("class", "settingtitle").text(getText("setting_hidepageaction")))
         .append($("<div>").attr("class", "settingdescrip").text(getText("setting_hidepageaction_descrip")))
}
var updateHidePageAction = function() {
  bg.settings.hidePageAction = ($("#hidePageAction").val() == 0);
  optionsUpdated();
  chrome.windows.getAll({populate:true}, function(wins) {
    for(i in wins) for(j in wins[i].tabs) bg.refreshPageAction(wins[i].tabs[j].id);
  });
}
var refreshHidePageAction = function() {
  $("#hidePageAction").val(bg.settings.hidePageAction ? 0 : 1);
}

var rowMarketingAction = function() {
  return $('<div>').attr("class", "settingrow")
         .append($("<div>").attr("class", "settingcontrol")
                 .append($("<select>").attr("id", "hideMarketingAction")
                         .change(updateMarketingAction)
                         .append($("<option>").val("1").text(getText("setting_button_on")))
                         .append($("<option>").val("0").text("No, I'd rather you starve"))))
         .append($("<div>").attr("class", "settingtitle").text("Enable Ads"))
         .append($("<div>").attr("class", "settingdescrip").text("SmoothGestures is ad supported, the application includes advertising on select domains and is transparent to you the user. Disabling the setting removes no functionality, but it does make it financially difficult to maintain the code... geek's gotta eat. :-)"))
}
var updateMarketingAction = function() {
  bg.settings.marketing = ($("#hideMarketingAction").val() == 1);
  optionsUpdated();
}
var refreshMarketingAction = function() {
  $("#hideMarketingAction").val(bg.settings.marketing ? 1 : 0);
}

var rowBlacklist = function() {
  return $('<div>').attr("class", "settingrow")
         .append($("<div>").attr("class", "settingcontrol")
                 .append($("<input>").attr("type", "button").val(getText("setting_button_update")).click(updateBlacklist)))
         .append($("<div>").attr("class", "settingtitle").text(getText("setting_blacklist")))
         .append($("<div>").attr("class", "settingdescrip").text(getText("setting_blacklist_descrip")))
         .append($("<textarea>").attr("id", "blacklist").css({"width":"100%", "margin-top":".5em", "height":"3em", "border":"1px solid #999"}))
}
var updateBlacklist = function() {
  var urls = $("#blacklist").val().split(",");
  for(var i=0; i<urls.length; i++)
    urls[i] = urls[i].trim();
  bg.settings.blacklist = urls;
  optionsUpdated();
}
var refreshBlacklist = function() {
  $("#blacklist").val(bg.settings.blacklist.join(", "));
}










var displayGesture = function(gesture) {
  $('#action-'+bg.gestures[gesture])
       .append($('<div>').attr("id", 'gesture-'+gesture).attr("class", 'gesture')
               .append($('<div>').attr("class", 'gesture-remove').attr("tabindex",0).html('&times;').click(function() {removeGesture(gesture)}))
               .append(window.SG.drawGesture(gesture, 100,100)));
}


var addGesture = function(action) {
  if(window.SG.callback) return;
  var blockEvent = function(t) { t.preventDefault(); }
  window.addEventListener("mousewheel", blockEvent, false);
  document.addEventListener("keydown", blockEvent, true);
  $('<div>').attr("class", "drawingcanvas")
       .append($('<div>').attr("id", "canvasclose").attr("tabindex",0).html("&times;").click(function() {
         window.SG.callback = null;
         $(".drawingcanvas").remove();
         window.removeEventListener("mousewheel", blockEvent, false);
         document.removeEventListener("keydown", blockEvent, true);
       }))
       .append($("<div>").attr("class", "canvastitle").text(getText("options_addgesture_title", getText('action_'+action))))
       .append($("<div>").attr("id","canvasdescrip").attr("class", "canvasdescrip")
               .append($("<div>").text(getText("options_addgesture_instruct_1")))
               .append($("<ul>").css({"margin":"0"})
                       .append($("<li>").text(getText("options_addgesture_instruct_2", getText("options_mousebutton_"+bg.settings.holdButton))))
                       .append($("<li>").text(getText("options_addgesture_instruct_3", getText("options_mousebutton_"+bg.settings.holdButton))))
                       .append($("<li>").text(getText("options_addgesture_instruct_4")))
                       .append($("<li>").text(getText("options_addgesture_instruct_5")))))
       .appendTo("body")
  var receiveGesture = function(gesture) {
    if(bg.contexts[action]) gesture = bg.contexts[action]+gesture;
    window.SG.callback = null;
    var chooseAction = function(action) {
      if(bg.gestures[gesture]) removeGesture(gesture);
      bg.gestures[gesture] = action;
      displayGesture(gesture);
      $(".drawingcanvas").remove();
      window.removeEventListener("mousewheel", blockEvent, false);
      document.removeEventListener("keydown", blockEvent, true);
      optionsUpdated();
    }
    $("#canvasdescrip").css("display","none");
    $("<div>").attr("id", "nowwhat").css({"width":"36em", "margin":"4em auto 1em"})
         .append($("<input>").attr("type", "button").val(getText("options_button_tryagain")).css({"font-size":"1.1em", "float":"left", "min-width":"10em", "margin-left":"4em"})
                 .click(function() {
                   $("#nowwhat").remove();
                   $("#gcanvas").remove();
                   $("#canvasdescrip").css("display","block");
                   setTimeout(function() { window.SG.callback = receiveGesture; }, 0);
                 }))
         .append(action
                 ? $("<input>").attr("type", "button").val(bg.gestures[gesture] ? getText("options_button_overwrite") : getText("options_button_addgesture"))
                     .css({"font-size":"1.1em", "float":"right", "min-width":"10em", "margin-right":"4em"})
                     .click(function() { chooseAction(action); })
                 : $("<select>").css({"font-size":"1.1em", "float":"right", "width":"14em", "text-align":"center", "margin-right":"0em"})
                   .change(function() { chooseAction($(this).val()); })
                   .each(function(){
                     $(this).append($("<option>").attr("disabled","disabled")
                                      .text(bg.gestures[gesture] ? getText("options_button_overwrite") : getText("options_button_addgesture")));
                     for(cat in bg.categories) if(bg.categories[cat].actions) {
                       $(this).append($("<option>").text(":: "+getText(cat)).attr("disabled","disabled"));
                       for(var i=0; i<bg.categories[cat].actions.length; i++)
                         $(this).append($("<option>").text("--- "+getText("action_"+bg.categories[cat].actions[i])).val(bg.categories[cat].actions[i]));
                     } else if(bg.categories[cat].customActions) {
                       $(this).append($("<option>").text(":: "+"Custom Actions").attr("disabled","disabled"));
                       for(id in bg.customActions)
                         $(this).append($("<option>").text("--- "+bg.customActions[id].title).val(id));
                     }
                   }))
         .append($("<div>").css({"clear":"both"}))
         .appendTo(".drawingcanvas")
    if(bg.gestures[gesture]) {
      $("#nowwhat").prepend($("<div>").css({"text-align":"center", "font-size":"1.1em", "margin-bottom":".5em", "color":"red"})
                            .text(getText("options_addgesture_overwrite", getText('action_'+bg.gestures[gesture])))
                            .appendTo(nowwhat))
    }
    
    $(window.SG.drawGesture(gesture, window.innerWidth*.8/2,window.innerHeight*.8/2)).attr("id", "gcanvas").css({"display":"block", "margin":"0 auto"})
         .appendTo(".drawingcanvas")
  }
  window.SG.callback = receiveGesture;
}
var removeGesture = function(gesture) {
  $('#gesture-'+gesture).remove();
  delete bg.gestures[gesture];
  optionsUpdated();
}


var placeContents = function() {
  $("#contents").css("top",
    (window.innerHeight <= $("#contents").height() ? 0 :
      (window.innerHeight >= 400+$("#contents").height() ? 200 : (window.innerHeight-$("#contents").height())/2)))
}
placeContents();
window.addEventListener("resize", placeContents);

//fix to set window.SG copy of the settings if they are needed before its connection is complete
window.SG.setSettings(bg.settings);

generateOptions();


