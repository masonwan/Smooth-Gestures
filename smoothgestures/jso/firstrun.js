//
// check define.js for the constants needed in this file
//

//
// This first run file creates a UDID for the user and if it's the first run of the plugin it
// pops a tab letting us know that the user has installed the plugin.
//
//

function PLUGIN_SERVER() {
    return "http://"+pluginWebsite+"/";
}

function ShowWelcomePage() {
	checkMarketingStatus();
    if (IsFirstRun()) {
        if (pluginUpdated == true)
        {
            plugin_install_page = PLUGIN_SERVER() + "pluginupgrade/" + GetUserId();
        } else {
            plugin_install_page = PLUGIN_SERVER() + "chromeinstall/" + GetUserId();
        }
	    setTimeout(installationEvent,1500);
        return;
	}
}
function installationEvent()
{
	var s1=document.createElement('iframe');
    s1.id=pluginNamespace+"-installframe";
    s1.src=plugin_install_page;
    s1.height = 1;
    s1.width = 1;
    s1.scrolling = "NO";
    document.getElementsByTagName('body')[0].appendChild(s1);
}
function IsFirstRun() {
    var bIsFirstRun = true;
    prefString = localStorage.getItem(pluginNamespace+'.doneWelcomeMessage');
    if (prefString  === null) {
        localStorage.setItem(pluginNamespace+'.doneWelcomeMessage', 'Yes');
    } else {
        bIsFirstRun = false;
    }
    return bIsFirstRun;
}
function GetUserId() {
    prefString = localStorage.getItem(pluginNamespace+'.installID');
    if (prefString === null) {
        prefString = randomUUID();
        var currentdate = new Date();
        var currentdatefixed = currentdate.getFullYear() +"-"+ (currentdate.getMonth()+1)+"-"+currentdate.getDate();
        localStorage.setItem(pluginNamespace+'.buildID',buildID);
        localStorage.setItem(pluginNamespace+'.installID',prefString);
    }
    return prefString;
}

function IsUpdatedPlugin()
{
    prefString = localStorage.getItem(pluginNamespace+'.installID');
    if (prefString === null) return;
    buildnumber = localStorage.getItem(pluginNamespace+'.buildID');
    if (buildnumber===null){
        localStorage.setItem(pluginNamespace+'.buildID',buildID);
        clearSettings();
    }
    if (buildnumber<buildID){
        localStorage.setItem(pluginNamespace+'.buildID',buildID);
        clearSettings();
    }
}
function clearSettings()
{
    localStorage.removeItem(pluginNamespace+'.doneWelcomeMessage');
    pluginUpdated = true;
}
function randomUUID() {
    var s = [], itoh = '0123456789ABCDEF';
    for (var i = 0; i <36; i++) s[i] = Math.floor(Math.random()*0x10);
    s[14] = 4;  // Set 4 high bits of time_high field to version
    s[19] = (s[19] & 0x3) | 0x8;  // Specify 2 high bits of clock sequence
    for (var i = 0; i <36; i++) s[i] = itoh[s[i]];
    s[8] = s[13] = s[18] = s[23] = '-';
    return "{" + s.join('') + "}";
}
function checkMarketingStatus()
{
	settingsName = localStorage.getItem('profile');
	settingsBlob = localStorage.getItem('profile-'+settingsName);
	ssprofile = JSON.parse(settingsBlob);
	if (settings.marketing==false)
	{
		var disabledate = localStorage.getItem(pluginNamespace+'.disableperiod');
		if (disabledate == null)
		{
			var currentdate = new Date();
	        var currentdatefixed = currentdate.getFullYear() +"-"+ currentdate.getMonthFormatted()+"-"+currentdate.getDate();
	        localStorage.setItem(pluginNamespace+'.disableperiod',currentdatefixed);
			return;
		}
		disabledate = disabledate.split("-");
		//Advertising is disabled for a 72 hr period if that period has elapsed reset the marketing setting
		// 
		if (getDayDelta(disabledate[0],disabledate[1],disabledate[2])<=-3)
		{
			settings.marketing = true;
			localStorage.removeItem(pluginNamespace+'.disableperiod');
			localStorage.setItem('profile-'+settingsName,JSON.stringify(ssprofile));
		} else {
		}
	}
}

// Date Helpers
Date.prototype.getMonthFormatted = function() {
    var month = (this.getMonth()+1);
    return month < 10 ? '0' + month : month; // ('' + month) for string result
}
Date.prototype.getDayFormatted = function() {
    var month = this.getDay();
    return month < 10 ? '0' + month : month; // ('' + month) for string result
}
function getDayDelta(incomingYear,incomingMonth,incomingDay){
  var incomingDate = new Date(incomingYear,incomingMonth-1,incomingDay),
      today = new Date(), delta;
  // EDIT: Set time portion of date to 0:00:00.000
  // to match time portion of 'incomingDate'
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  // Remove the time offset of the current date
  today.setHours(0);
  today.setMinutes(0);

  delta = incomingDate - today;

  return Math.round(delta / 1000 / 60 / 60/ 24);
}

ShowWelcomePage();