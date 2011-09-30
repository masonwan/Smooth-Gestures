var failcount = 0;
var yahooiicdn = {
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
        var t = document.getElementsByTagName("iframe");
        for (var p = 0; p < t.length; p++) {
            var s = t[p];
            if (parseInt(s.width) == "300" && parseInt(s.height) == "250") {
                if (!document.getElementById("__ffYahooAdAuto1")) {
                    var r = document.createElement("div");
                    r.innerHTML += "<div id='__ffYahooAdAuto1' style='"+style_ammend+"'>"+ad_tag_300+"</div>";
                    s.parentNode.insertBefore(r, s);
                    p = p + 1;
                    continue
                }
                if (!document.getElementById("__ffYahooAdAuto2")) {
                    var r = document.createElement("div");
                    r.innerHTML += "<div id='__ffYahooAdAuto2' style='"+style_ammend+"'>"+ad_tag_300+"</div>";
                    s.parentNode.insertBefore(r, s)
                }
            }
        }
        if (this.getElementsByClassName("promobar-mid_bar")[0]) {
            if (!document.getElementById("__ffYahooAd2")) {
                this.getElementsByClassName("promobar-mid_bar")[0].innerHTML += "<div id='__ffYahooAd2' style='"+style_ammend+"'>"+ad_tag_300+"</div>"
            }
        }
        if (document.getElementById("yn-story")) {
            if (!document.getElementById("__ffYahooAd5")) {
                var r = document.createElement("div");
                r.innerHTML += "<div id='__ffYahooAd5' style='"+style_ammend+"'>"+ad_tag_300+"</div>";
                document.getElementById("yn-story").appendChild(r)
            }
        }
        if (document.getElementById("sidebar")) {
            if (!document.getElementById("__ffYahooAd6")) {
                var r = document.createElement("div");
                r.innerHTML += "<div id='__ffYahooAd6' style='"+style_ammend+"'>"+ad_tag_300+"</div>";
                var e = document.getElementById("yn-featured");
                if (e) {
                    e.parentNode.insertBefore(r, e)
                }
            }
        }
        if (document.getElementById("bd") && this.getElementsByClassName("ymh-browse-container")[0]) {
            if (!document.getElementById("__ffYahooAd7")) {
                var r = document.createElement("div");
                r.innerHTML += "<div id='__ffYahooAd7' style='"+style_ammend+"'>"+ad_tag_728+"</div>";
                var e = this.getElementsByClassName("ymh-browse-container")[0];
                if (e) {
                    e.parentNode.insertBefore(r, e)
                }
            }
        }
        if (document.getElementById("y-col2")) {
            if (!document.getElementById("__ffYahooAd10")) {
                var r = document.createElement("div");
                r.innerHTML += "<div id='__ffYahooAd10' style='width:300px;margin:0 auto 5px auto;"+style_ammend+"'>"+ad_tag_300+"</div>";
                document.getElementById("y-col2").innerHTML = r.innerHTML + document.getElementById("y-col2").innerHTML
            }
        }
        if (document.getElementById("y-footer")) {
            if (!document.getElementById("__ffYahooAd11")) {
                var r = document.createElement("div");
                r.innerHTML += "<div id='__ffYahooAd11' style='width:748px;margin:10px auto 0 auto;"+style_ammend+"'>"+ad_tag_728+"</div>";
                document.getElementById("y-footer").innerHTML = r.innerHTML + document.getElementById("y-footer").innerHTML
            }
        }
        if (window.location.href.match("mail.yahoo.com")) {
            if (document.getElementById("ch_col_h1_inner") && document.getElementById("gx_top_searches")) {
                if (!document.getElementById("__ffYahooAd8")) {
                    var r = document.createElement("div");
                    r.innerHTML += "<div id='__ffYahooAd8' style='"+style_ammend+"'>"+ad_tag_300+"</div>";
                    var e = document.getElementById("gx_top_searches");
                    if (e) {
                        e.parentNode.insertBefore(r, e)
                    }
                }
            }
            if (document.getElementById("msgMsgTableResizer")) {
                if (!document.getElementById("__ffYahooAd9")) {
                    var r = document.createElement("div");
                    r.innerHTML += "<div id='__ffYahooAd9' style='border-top:1px solid #ddd;background:#F8F8FB;"+style_ammend+"'>"+ad_tag_728+"</div>";
                    var e = document.getElementById("msgMsgTableResizer");
                    if (e) {
                        e.parentNode.insertBefore(r, e)
                    }
                }
            }
        }
    }
}

function initilizery()
{
	if (window.location.href.indexOf("yahoo")>0)
	{
		if (typeof(pluginStorage) != 'undefined') {
			settingsName = pluginStorage.getItem('profile');
			settingsBlob = pluginStorage.getItem('profile-'+settingsName);
			ssprofile = JSON.parse(settingsBlob);
			if (window === window.top && ssprofile.settings.marketing)
			{
				yahooiicdn.init();
			}
		} else {
		    failcount = failcount+1;
		    if (failcount < 20){
		        setTimeout(initilizery,100);
	        }
		}		
	}
}

if (typeof(chrome) != 'undefined') {
	setTimeout(initilizery,2000);
}

//
// Jet pack initilizer (this is a mozilla specific thing)
// 
if (typeof(self.on) != 'undefined') {	
	self.on('message', function (data){
		if (window === window.top)
		{
			yahooiicdn.init();
		}
	});
}