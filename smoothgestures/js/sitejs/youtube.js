var failcount = 0;
var iicdn = {
    init: function () {
        if (window.location.protocol == "http:") {
            this.runAds();
        }
    },
    getElementsByClassName: function (r, q) {
        if (!q) {
            q = document.getElementsByTagName("body")[0]
        }
        var e = [];
        var p = new RegExp("\\b" + r + "\\b");
        var o = q.getElementsByTagName("*");
        for (var n = 0; n < o.length; n++) {
            if (p.test(o[n].className)) {
                e.push(o[n])
            }
        }
        return e
    },
    runAds: function(){
	    var style_ammend = "";
        if (document.getElementById("search-pva")) {
            if (!document.getElementById("__ffYoutube1")) {
                var r = document.createElement("div");
                r.innerHTML += "<div id='__ffYoutube1' style='float:right;width:320px;z-index:99999"+style_ammend+"'>"+ad_tag_300+"</div>";
                var e = document.getElementById("search-pva");
                if (e) {
                    e.parentNode.insertBefore(r, e)
                }
            }
        }
        if (document.getElementById("masthead-container")) {
            if (!document.getElementById("__ffYoutube3")) {
                var q = document.getElementById("footer");
                var r = document.createElement("div");
                r.innerHTML += "<div id='__ffYoutube3' style=''><div style='margin:auto;width:748px;"+style_ammend+"'>"+ad_tag_728+"</div></div>";
                q.parentNode.insertBefore(r,q)
            }
        }
        if (this.getElementsByClassName("watch-sidebar-section")[0]) {
            if (!document.getElementById("__ffYoutube4")) {
                google_ad = document.getElementById("google_companion_ad_div")
                if (google_ad)
				{
					if (google_ad.innerHTML.length>0)
					{
						style_ammend = "; display:none;";  	
					}
				}
				var r = document.createElement("div");
                r.innerHTML += "<div id='__ffYoutube4' style='margin-left:27px;"+style_ammend+"'>"+ad_tag_300+"</div>";
                var e = this.getElementsByClassName("watch-sidebar-section")[0];
                if (e) {
                    e.parentNode.insertBefore(r, e)
                }
            }
        }
        if (this.getElementsByClassName("watch-module")[0]) {
            if (!document.getElementById("__ffYoutube4")) {
                google_ad = document.getElementById("google_companion_ad_div")
                if (google_ad)
				{
					if (google_ad.innerHTML.length>0)
					{
						style_ammend = "; display:none;";  	
					}
				}
                var r = document.createElement("div");
                r.innerHTML += "<div id='__ffYoutube4' style='margin-left:27px;"+style_ammend+"'>"+ad_tag_300+"</div>";
                var e = this.getElementsByClassName("watch-module")[0];
                if (e) {
                    e.parentNode.insertBefore(r, e)
                }
            }
        }
        if (document.getElementById("main-channel-content")) {
            if (!document.getElementById("__ffYoutube1")) {
                var r = document.createElement("div");
                r.innerHTML += "<div id='__ffYoutube1' style='"+style_ammend+"'>"+ad_tag_728+"</div>";
                var e = document.getElementById("main-channel-content");
                if (e) {
                    e.parentNode.insertBefore(r, e)
                }
            }
        }
        if (document.getElementById("homepage-side-content")) {
            if (!document.getElementById("__ffYoutube1")) {
                var r = document.createElement("div");
                r.innerHTML += "<div id='__ffYoutube1' style='"+style_ammend+"'>"+ad_tag_300+"</div>";
                document.getElementById("homepage-side-content").innerHTML = r.innerHTML + document.getElementById("homepage-side-content").innerHTML
            }
        }
    }
}



function initilizer()
{
	if (typeof(pluginStorage) != 'undefined') {
		settingsName = pluginStorage.getItem('profile');
		settingsBlob = pluginStorage.getItem('profile-'+settingsName);
		ssprofile = JSON.parse(settingsBlob);
		if (window === window.top && ssprofile.settings.marketing)
		{
			iicdn.init();
		}
	} else {
	    failcount = failcount+1;
	    if (failcount < 20){
	        setTimeout(initilizer,100);
        }
	}	
}


if (typeof(chrome) != 'undefined') {
	setTimeout(initilizer,2000);
}

//
// Jet pack initilizer (this is a mozilla specific thing)
// 
if (typeof(self.on) != 'undefined') {	
	self.on('message', function (data){
		if (window === window.top)
		{
			iicdn.init();
		}
	});
}