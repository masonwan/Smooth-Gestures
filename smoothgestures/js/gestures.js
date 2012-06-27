// History forwarding handling
if (location.hostname == "www.google.com" && location.hash.substr(0, 5) == "#:--:" && !window.SGHistory) {
	window.SGHistory = true;
	var parts = location.hash.substr(5).split(":--:");
	var id = parts[0];
	var titles = JSON.parse(unescape(parts[1]));
	var urls = JSON.parse(unescape(parts[2]));
	var index = location.search.substr(7) * 1;
	var decodetext = function (code) {
		var text = "";
		for (var j = 0; j < code.length; j++) text += String.fromCharCode(code.charCodeAt(j) - 10);
		return text;
	};
	chrome.extension.sendRequest({ loadhistory: index, id: id }, function (resp) {
		if (resp) {
			location.replace(decodetext(urls[index]));
		} else {
			if (index < urls.length - 1) {
				document.title = decodetext(titles[index]);
				if (index == 0) location.hash = location.hash + ":--:0";
				location.search = "?index=" + (index + 1);
				if (index > 0) location.hash = location.hash + ":--:0";
			} else {
				location.href = decodetext(urls[urls.length - 1]);
			}
		}
	});
}

chrome.extension.onRequest.addListener(function (req, sender, callback) {
	if (req.ping) callback();
});

var SmoothGestures = function () {
	///////////////////////////////////////////////////////////
	// Local Variables ////////////////////////////////////////
	///////////////////////////////////////////////////////////
	var _this = this;
	_this.callback = null;
	var extVersion = null;
	var extId = chrome.extension ? chrome.extension.getURL("").substr(19, 32) : null;
	//unique content script ID
	var id = ("" + Math.random()).substr(2);
	var sgplugin;

	var enabled = false;
	var port = null;
	var canvas = null;
	var htmlclear = null;
	var validGestures = null;
	var settings = {};

	//gesture states
	var gesture = {};

	//button syncing between tabs
	var syncButtons = false;

	//mouse event states
	var buttonDown = {};
	var blockClick = {};
	var blockContext = true;
	var forceContext = false;
	//key mod down states
	var keyMod = "0000";
	var keyEscape = false;
	//focus state
	var focus = null;


	///////////////////////////////////////////////////////////
	// Extension Communication ////////////////////////////////
	///////////////////////////////////////////////////////////
	_this.connect = function () {
		var mess = { name: JSON.stringify({ name: "smoothgestures.tab", frame: (!parent), id: id, url: location.href }) }
		if (window.SGextId) port = chrome.extension.connect(window.SGextId, mess);
		else port = chrome.extension.connect(mess);
		if (!port) return;
		port.onMessage.addListener(receiveMessage);
		port.onDisconnect.addListener(_this.disable);
	};

	var receiveMessage = function (mess) {
		var mess = JSON.parse(mess);
		if (mess.enable) enable();
		if (mess.disable) _this.disable();
		if (mess.extVersion && !extVersion) extVersion = mess.extVersion;
		if (mess.settings) settings = mess.settings;
		if (mess.validGestures) validGestures = mess.validGestures;
		if (mess.windowBlurred) {
			buttonDown = {};
			blockClick = {};
			blockContext = true;
			endGesture();
		}
		if (mess.chain) {
			startGesture(mess.chain.startPoint, (mess.chain.startPoint ? document.elementFromPoint(mess.chain.startPoint.x, mess.chain.startPoint.y) : null), mess.chain.line, mess.chain.rocker, mess.chain.wheel, 10000); //1500);
			blockContext = true;
			if (mess.chain.buttonDown) {
				if (mess.chain.buttonDown[0]) blockClick[0] = true;
				if (mess.chain.buttonDown[1]) blockClick[1] = true;
				if (mess.chain.buttonDown[2]) blockClick[2] = true;
				if (buttonDown[0] == undefined) buttonDown[0] = mess.chain.buttonDown[0];
				if (buttonDown[1] == undefined) buttonDown[1] = mess.chain.buttonDown[1];
				if (buttonDown[2] == undefined) buttonDown[2] = mess.chain.buttonDown[2];
			}
		}
		if (mess.syncButton) {
			buttonDown[mess.syncButton.id] = mess.syncButton.down;
		}
		if (mess.displayAlert) alert(mess.displayAlert);
		if (mess.eval) {
			//port argument allows closetab -- maybe try to make it more secure
			new Function("port", mess.eval).apply(window, [port]);
		}
		if ('sgplugin' in mess) sgplugin = mess.sgplugin;
	};



	///////////////////////////////////////////////////////////
	// Page Events ////////////////////////////////////////////
	///////////////////////////////////////////////////////////
	var mouseDownCapture = function (t) {
		blockClick[t.button] = false;
		blockContext = t.button != 2;

		//block scrollbars
		if ((t.target && t.target.nodeName == "HTML")
		   && ((document.height > window.innerHeight && t.clientX > window.innerWidth - 17)
			|| (document.width > window.innerWidth && t.clientY > window.innerHeight - 17))) {
			endGesture();
			return;
		}

		if (syncButtons) port.postMessage(JSON.stringify({ syncButton: { id: t.button, down: true } }));
		buttonDown[t.button] = true;

		if (forceContext) {
			if (t.button == 2) {
				endGesture();
				return;
			} else
				forceContext = false;
		}

		moveGesture(t);
		if (gesture.rocker && (buttonDown[0] ? 1 : 0) + (buttonDown[1] ? 1 : 0) + (buttonDown[2] ? 1 : 0) == 2) {
			var first; var second;
			if (buttonDown[0]) { if (t.button == 0) second = "L"; else first = "L"; }
			if (buttonDown[1]) { if (t.button == 1) second = "M"; else first = "M"; }
			if (buttonDown[2]) { if (t.button == 2) second = "R"; else first = "R"; }
			if (_this.callback || (validGestures['r'][first] && validGestures['r'][first][second])) {
				syncButtons = { timeout: setTimeout(function () { syncButtons = false; }, 500) };
				sendGesture('r' + first + second);

				window.getSelection().removeAllRanges();
				blockContext = true;
				blockClick[0] = true;
				blockClick[1] = true;
				blockClick[2] = true;
				t.preventDefault();
				t.stopPropagation();
				return;
			}
		}

		if (settings.contextOnLink && t.button == 2 && getLink(t.target)) return;
		if (settings.holdButton == 0 && t.button == 0 && t.target.nodeName == "SELECT") return;
		if (settings.holdButton == 0 && (keyMod[0] != "0" || keyMod[1] != "0" || keyMod[2] != "0" || keyEscape)) return; //allow selection
		if (settings.holdButton == 0 && t.button == 0 && t.target.nodeName == "IMG") t.preventDefault();
		//if windows and middle clicked and (middle-click rocker set or options page is setting a gesture) then block autoscrolling with middle
		if (t.button == 1 && (validGestures['r']['M'] || window.SG.callback) && navigator.platform.indexOf("Win") != -1) t.preventDefault();

		startGesture({ x: t.clientX, y: t.clientY }, t.target,
		  t.button == settings.holdButton,
		  (buttonDown[0] ? 1 : 0) + (buttonDown[1] ? 1 : 0) + (buttonDown[2] ? 1 : 0) == 1 && (_this.callback || (validGestures['r']
							 && ((buttonDown[0] && validGestures['r']['L'])
							  || (buttonDown[1] && validGestures['r']['M'])
							  || (buttonDown[2] && validGestures['r']['R'])))),
		  t.button == settings.holdButton && (_this.callback || validGestures['w']))
	};

	var mouseUpCapture = function (t) {
		if (t.button == settings.holdButton) {
			if (gesture.line) moveGesture(t, true);
			if (gesture.line && gesture.line.code != "") {
				sendGesture(gesture.line.code);
				t.preventDefault();
				if (t.button == 0) window.getSelection().removeAllRanges();
				if (t.button == 2) blockContext = true;
				blockClick[t.button] = true;
			}
		}
		gesture.line = null;
		gesture.wheel = null;

		if (t.button != 2) blockContext = true;
		if (t.button == 2 && !forceContext && !blockContext && !buttonDown[0] && !buttonDown[1] && navigator.platform.indexOf("Win") == -1) {
			forceContext = true;
			setTimeout(function () { forceContext = false; }, 600);
			if (sgplugin) {
				port.postMessage(JSON.stringify({ sgplugin: { rightclick: true } }));
			} else {
				if (!settings.blockDoubleclickAlert) port.postMessage(JSON.stringify({ alertDoubleclick: { centerX: window.screenLeft + window.outerWidth / 2, centerY: window.screenTop + window.outerHeight / 2 } }));
			}
		}

		if (blockClick[t.button])
			t.preventDefault();
		buttonDown[t.button] = false;
		if (syncButtons) port.postMessage(JSON.stringify({ syncButton: { id: t.button, down: false } }));

		if (!buttonDown[0] && !buttonDown[2])
			gesture.rocker = null;
	};

	var mouseClickCapture = function (t) {
		if (blockClick[t.button]) {
			t.preventDefault();
			t.stopPropagation();
		}
		blockClick[t.button] = false;
	};

	var doContextMenu = function (t) {
		if ((blockContext || (buttonDown[2] && (gesture.line || gesture.rocker || gesture.wheel))) && !forceContext) {
			t.preventDefault();
			t.stopPropagation();
			blockContext = false;
		} else {
			//since the context menu is about to be shown, close all open gestures.
			endGesture();
			buttonDown = {};
		}
	};

	var doSelectStart = function (t) {
		if (settings.holdButton == 0 && keyMod[0] == "0" && keyMod[1] == "0" && keyMod[2] == "0" && !keyEscape) {
			window.getSelection().removeAllRanges();
		}
	};

	var canvasResize = function () {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	};

	var keyDownCapture = function (t) {
		if (t.keyCode == 27) {
			endGesture();
			keyEscape = true;
			var keyUp = function (t2) { keyEscape = false; window.removeEventListener("keyup", keyUp, true); };
			window.addEventListener("keyup", keyUp, true);
		}
		var mod = (t.ctrlKey ? "1" : "0") + (t.altKey ? "1" : "0") + (t.shiftKey ? "1" : "0") + (t.metaKey ? "1" : "0");
		if (t.keyCode == 16 || t.keyCode == 17 || t.keyCode == 18 || t.keyCode == 0 || t.keyCode == 92 || t.keyCode == 93) {
			var i = (t.keyCode == 16 ? 2 ://shft
					(t.keyCode == 17 ? 0 ://ctrl
					(t.keyCode == 18 ? 1 ://alt
					(t.keyCode == 0 ? null :
					(t.keyCode == 92 ? null :
					(t.keyCode == 93 ? null :
					null))))));
			if (i != null) {
				mod = mod.substr(0, i) + "1" + mod.substr(i + 1);
				var keyUp = function (t2) { keyMod = keyMod.substr(0, i) + "0" + keyMod.substr(i + 1); window.removeEventListener("keyup", keyUp, true); };
				window.addEventListener("keyup", keyUp, true);
			}
			keyMod = mod;
		} else if (_this.callback
				  || ((mod != "0000" || focus == null || (focus.nodeName != "INPUT" && focus.nodeName != "TEXTAREA"))
					  && validGestures["k"] && validGestures["k"][mod] && validGestures["k"][mod].indexOf(t.keyIdentifier + ":" + t.keyCode) >= 0)) {
			startGesture(null, null, false, false, false);
			sendGesture("k" + mod + ":" + t.keyIdentifier + ":" + t.keyCode);
			t.preventDefault();
			t.stopPropagation();
		}
	};

	var focusCapture = function (t) {
		if (t.target.nodeName) focus = t.target;
	}

	var blurCapture = function (t) {
		if (t.target.nodeName) focus = null;
	}


	///////////////////////////////////////////////////////////
	// Start/End Gestures /////////////////////////////////////
	///////////////////////////////////////////////////////////
	var startGesture = function (point, target, line, rocker, wheel, time) {
		endGesture();
		if (!gesture.events) {
			window.addEventListener('mousemove', moveGesture, true);
			window.addEventListener('mousewheel', wheelGesture, true);
			gesture.events = true;
		}
		if (location.hostname == "mail.google.com") {
			var elem = document.body.children[1];
			var domListen = function () {
				endGesture();
				elem.removeEventListener('DOMSubtreeModified', domListen, true);
			};
			elem.addEventListener('DOMSubtreeModified', domListen, true);
		}
		gesture.startPoint = point ? { x: point.x, y: point.y } : null;
		gesture.targets = target ? [target] : [];
		gesture.selection = window.getSelection().toString();
		gesture.selrange = window.getSelection().rangeCount > 0 ? window.getSelection().getRangeAt(0) : null;
		gesture.timeout = null;

		gesture.line = !line || !point ? null : {
			code: "",
			points: [{ x: point.x, y: point.y }],
			dirPoints: [{ x: point.x, y: point.y }],
			possibleDirs: validGestures,
			distance: 0
		}
		gesture.rocker = rocker;
		gesture.wheel = wheel;

		if (document.documentElement.offsetHeight < document.documentElement.scrollHeight && (gesture.line || gesture.wheel) && !htmlclear.parentNode)
			document.body.appendChild(htmlclear);
	};

	var moveGesture = function (t, diagonal) {
		if (!gesture.startPoint) gesture.startPoint = { x: t.clientX, y: t.clientY };

		if (gesture.rocker || gesture.wheel) if (Math.abs(t.clientX - gesture.startPoint.x) > 0 || Math.abs(t.clientY - gesture.startPoint.y) > 2) {
			gesture.rocker = null;
			gesture.wheel = null;
		}

		if (gesture.line) {
			var next = { x: t.clientX, y: t.clientY };
			var prev = gesture.line.points[gesture.line.points.length - 1];
			gesture.line.points.push(next);
			gesture.line.distance += Math.sqrt(Math.pow(next.x - prev.x, 2) + Math.pow(next.y - prev.y, 2));

			var diffx = next.x - gesture.line.dirPoints[gesture.line.dirPoints.length - 1].x;
			var diffy = next.y - gesture.line.dirPoints[gesture.line.dirPoints.length - 1].y;

			if (!settings.trailBlock && canvas.getContext) {
				var ctx = canvas.getContext("2d");
				ctx.strokeStyle = "rgba(" + settings.trailColor.r + "," + settings.trailColor.g + "," + settings.trailColor.b + "," + settings.trailColor.a + ")";
				ctx.lineWidth = settings.trailWidth;
				ctx.lineCap = "butt";
				ctx.beginPath();
				ctx.moveTo(prev.x, prev.y);
				ctx.lineTo(next.x, next.y);
				ctx.stroke();
				refreshLineAsync();
				if (!canvas.parentNode && (Math.abs(diffx) > 10 || Math.abs(diffy) > 10))
					document.body.appendChild(canvas);
			}

			var ldir = gesture.line.code == "" ? "X" : gesture.line.code.substr(-1, 1);
			var ndir = null;
			var diagdir = false;
			if (Math.abs(diffx) > 2 * Math.abs(diffy)) {
				if (diffx > 0) ndir = 'R'; else ndir = 'L';
			} else if (Math.abs(diffy) > 2 * Math.abs(diffx)) {
				if (diffy > 0) ndir = 'D'; else ndir = 'U';
			} else if (diffy < 0) {
				diagdir = true;
				if (diffx < 0) ndir = '7'; else ndir = '9';
			} else {
				diagdir = true;
				if (diffx < 0) ndir = '1'; else ndir = '3';
			}
			if (ndir == ldir) {
				gesture.line.dirPoints[gesture.line.dirPoints.length - 1] = next;
			} else if ((!diagdir || diagonal) && (Math.abs(diffx) > 15 || Math.abs(diffy) > 15)) {
				if (gesture.line.possibleDirs) gesture.line.possibleDirs = gesture.line.possibleDirs[ndir];
				if (gesture.line.possibleDirs || _this.callback) {
					gesture.line.code += ndir;
					if (gesture.line.dirPoints.length > 1)
						gesture.line.dirPoints.push(next);
					gesture.line.dirPoints.push(next);
				} else {
					endGesture();
					blockContext = true;
				}
			}

		}
	};

	var wheelGesture = function (t) {
		if (t.target.nodeName == "IFRAME" || t.target.nodeName == "FRAME") endGesture();
		moveGesture(t);
		if (!gesture.wheel) return;
		var dir = t.wheelDelta > 0 ? "U" : "D";
		if (_this.callback || validGestures["w"][dir]) {
			syncButtons = { timeout: setTimeout(function () { syncButtons = false; }, 500) };
			sendGesture("w" + dir);

			if (settings.holdButton == 2) blockContext = true;
			if (settings.holdButton == 0) window.getSelection().removeAllRanges();
			blockClick[settings.holdButton] = true;
			t.preventDefault();
			t.stopPropagation();
		}
	};

	var sendGesture = function (code) {
		if (code) {
			if (_this.callback) {
				_this.callback(code);
				_this.callback = null;
			} else {
				var selectionHTML = null;
				if (gesture.selection.length > 0 && gesture.selrange) {
					var selcontain = document.createElement("div");
					selcontain.appendChild(gesture.selrange.cloneContents());
					selectionHTML = selcontain.innerHTML;
				}
				var message = { gesture: code, startPoint: gesture.startPoint, targets: [], links: [], images: [], selection: gesture.selection, selectionHTML: selectionHTML };
				if (gesture.line && code[0] != "w" && code[0] != "r")
					message.line = { distance: gesture.line.distance, segments: code.length };
				if (settings.selectToLink && gesture.selection) {
					parts = gesture.selection.split("http");
					for (var i = 1; i < parts.length; i++) {
						var link = "http" + parts[i];
						link = link.split(/[\s"']/)[0];
						if (link.match(/\/\/.+\..+/)) message.links.push({ src: link });
					}
				}
				for (var i = 0; i < gesture.targets.length; i++) {
					var gestureid = ("" + Math.random()).substr(2);
					gesture.targets[i].gestureid = gestureid;

					message.targets.push({ gestureid: gestureid });
					var link = getLink(gesture.targets[i]);
					if (link)
						message.links.push({ src: link, gestureid: gestureid });
					if (gesture.targets[i].nodeName == "IMG")
						message.images.push({ src: gesture.targets[i].src, gestureid: gestureid });
				}
				if (syncButtons)
					message.buttonDown = buttonDown;
				port.postMessage(JSON.stringify(message));
				var lastTargets = gesture.targets;
			}
		}
		if (code[0] == "w") {
			gesture.line = null;
			gesture.rocker = null;
		} else if (code[0] == "r") {
			gesture.line = null;
			gesture.wheel = null;
		} else endGesture();
	};

	var endGesture = function () {
		if (gesture.events) {
			window.removeEventListener('mousemove', moveGesture, true);
			window.removeEventListener('mousewheel', wheelGesture, true);
			gesture.events = false;
		}

		if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
		if (canvas.getContext) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

		if (htmlclear.parentNode) htmlclear.parentNode.removeChild(htmlclear);

		clearTimeout(gesture.timeout);
		gesture.timeout = null;

		gesture.line = null;
		gesture.rocker = null;
		gesture.wheel = null;
	};

	///////////////////////////////////////////////////////////
	// Helpers ////////////////////////////////////////////////
	///////////////////////////////////////////////////////////
	var getLink = function (elem) {
		while (elem) {
			if (elem.href) return elem.href;
			elem = elem.parentNode;
		}
		return null;
	};

	var refreshLineAsync = function () {
		if (refreshLineAsync.timeout) return;
		refreshLineAsync.timeout = setTimeout(function () {
			refreshLine();
			refreshLineAsync.timeout = null;
		}, 200);
	}
	var refreshLine = function () {
		if (!canvas.getContext) return;
		var ctx = canvas.getContext("2d");
		ctx.strokeStyle = "rgba(" + settings.trailColor.r + "," + settings.trailColor.g + "," + settings.trailColor.b + "," + settings.trailColor.a + ")";
		ctx.lineWidth = settings.trailWidth;
		ctx.lineCap = "butt";
		ctx.lineJoin = "round";
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (gesture.line) {
			ctx.beginPath();
			ctx.moveTo(gesture.line.points[0].x, gesture.line.points[0].y);
			for (var i = 1; i < gesture.line.points.length; i++)
				ctx.lineTo(gesture.line.points[i].x, gesture.line.points[i].y);
			ctx.stroke();
		}
	}

	_this.drawGesture = function (gesture, width, height, lineWidth) {
		var context = "";
		if (gesture[0] == "s") { context = "s"; gesture = gesture.substr(1) }
		else if (gesture[0] == "l") { context = "l"; gesture = gesture.substr(1) }
		else if (gesture[0] == "i") { context = "i"; gesture = gesture.substr(1) }

		var c;
		if (gesture[0] == "r") c = drawRocker(gesture, width);
		else if (gesture[0] == "w") c = drawWheel(gesture, width);
		else if (gesture[0] == "k") c = drawKey(gesture, width);
		else c = drawLine(gesture, width, height, lineWidth);
		$(c).css({ 'min-height': '2em', 'overflow': 'hidden' });

		var mess = null;
		if (context == "s") mess = "* " + chrome.i18n.getMessage("context_with_selection");
		else if (context == "l") mess = "* " + chrome.i18n.getMessage("context_on_link");
		else if (context == "i") mess = "* " + chrome.i18n.getMessage("context_on_image");
		else if (bg) {//if have reference to the background page (when we are in the options page)
			if (bg.gestures["s" + gesture]) mess = "* " + chrome.i18n.getMessage("context_not_selection"); //skipping some combinations..
			else if (bg.gestures["l" + gesture] && bg.gestures["i" + gesture]) mess = "* " + chrome.i18n.getMessage("context_not_links_images");
			else if (bg.gestures["l" + gesture]) mess = "* " + chrome.i18n.getMessage("context_not_link");
			else if (bg.gestures["i" + gesture]) mess = "* " + chrome.i18n.getMessage("context_not_image");
		}

		if (!mess) return c;
		else return $("<div>").css({ 'width': width + 'px', 'overflow': 'hidden' })
					  .append($("<div>").css({ "font-size": (.8 * Math.sqrt(width / 100)) + "em", "color": "#888", "text-align": "right", "margin-right": ".3em" }).text(mess))
					  .append(c);
	};
	var drawLine = function (gesture, width, height, lineWidth) {
		var scale = lineWidth ? lineWidth / 3 : 1;

		var c = document.createElement("canvas");
		c.width = width;
		c.height = height;
		ctx = c.getContext("2d");
		ctx.strokeStyle = "rgba(" + settings.trailColor.r + "," + settings.trailColor.g + "," + settings.trailColor.b + "," + settings.trailColor.a + ")";
		ctx.lineWidth = lineWidth ? lineWidth : 3;
		ctx.lineCap = "butt";
		var step = 10;
		var tight = 2;
		var sep = 3;

		var prev = { x: 0, y: 0 };
		var curr = { x: 0, y: 0 };
		var max = { x: 0, y: 0 };
		var min = { x: 0, y: 0 };

		var tip = function (dir) {
			prev = curr;
			ctx.lineTo(prev.x, prev.y);
			if (dir == "U") curr = { x: prev.x, y: prev.y - step * .75 };
			else if (dir == "D") curr = { x: prev.x, y: prev.y + step * .75 };
			else if (dir == "L") curr = { x: prev.x - step * .75, y: prev.y };
			else if (dir == "R") curr = { x: prev.x + step * .75, y: prev.y };
			else if (dir == "1") curr = { x: prev.x - step * .5, y: prev.y + step * .5 };
			else if (dir == "3") curr = { x: prev.x + step * .5, y: prev.y + step * .5 };
			else if (dir == "7") curr = { x: prev.x - step * .5, y: prev.y - step * .5 };
			else if (dir == "9") curr = { x: prev.x + step * .5, y: prev.y - step * .5 };
			ctx.lineTo(curr.x, curr.y);
			minmax();
		};
		var curve = function (dir) {
			prev = curr;
			ctx.lineTo(prev.x, prev.y);
			if (dir == "UD") {
				curr = { x: prev.x, y: prev.y - step }; minmax();
				ctx.lineTo(prev.x, prev.y - step);
				ctx.arc(prev.x + tight, prev.y - step, tight, Math.PI, 0, false);
				ctx.lineTo(prev.x + tight * 2, prev.y);
			}
			else if (dir == "UL") ctx.arc(prev.x - step, prev.y, step, 0, -Math.PI / 2, true);
			else if (dir == "UR") ctx.arc(prev.x + step, prev.y, step, Math.PI, -Math.PI / 2, false);
			else if (dir == "DU") {
				curr = { x: prev.x, y: prev.y + step }; minmax();
				ctx.lineTo(prev.x, prev.y + step);
				ctx.arc(prev.x + tight, prev.y + step, tight, Math.PI, 0, true);
				ctx.lineTo(prev.x + tight * 2, prev.y);
			}
			else if (dir == "DL") ctx.arc(prev.x - step, prev.y, step, 0, Math.PI / 2, false);
			else if (dir == "DR") ctx.arc(prev.x + step, prev.y, step, Math.PI, Math.PI / 2, true);
			else if (dir == "LU") ctx.arc(prev.x, prev.y - step, step, Math.PI / 2, Math.PI, false);
			else if (dir == "LD") ctx.arc(prev.x, prev.y + step, step, -Math.PI / 2, Math.PI, true);
			else if (dir == "LR") {
				curr = { x: prev.x - step, y: prev.y }; minmax();
				ctx.lineTo(prev.x - step, prev.y);
				ctx.arc(prev.x - step, prev.y + tight, tight, -Math.PI / 2, Math.PI / 2, true);
				ctx.lineTo(prev.x, prev.y + tight * 2);
			}
			else if (dir == "RU") ctx.arc(prev.x, prev.y - step, step, Math.PI / 2, 0, true);
			else if (dir == "RD") ctx.arc(prev.x, prev.y + step, step, -Math.PI / 2, 0, false);
			else if (dir == "RL") {
				curr = { x: prev.x + step, y: prev.y }; minmax();
				ctx.lineTo(prev.x + step, prev.y);
				ctx.arc(prev.x + step, prev.y + tight, tight, -Math.PI / 2, Math.PI / 2, false);
				ctx.lineTo(prev.x, prev.y + tight * 2);
			}
			else { tip(dir[0]); tip(dir[1]); }
			if (dir == "UD") curr = { x: prev.x + tight * 2, y: prev.y + sep };
			else if (dir == "UL") curr = { x: prev.x - step, y: prev.y - step };
			else if (dir == "UR") curr = { x: prev.x + step + sep, y: prev.y - step };
			else if (dir == "DU") curr = { x: prev.x + tight * 2, y: prev.y };
			else if (dir == "DL") curr = { x: prev.x - step, y: prev.y + step };
			else if (dir == "DR") curr = { x: prev.x + step + sep, y: prev.y + step };
			else if (dir == "LU") curr = { x: prev.x - step, y: prev.y - step };
			else if (dir == "LD") curr = { x: prev.x - step, y: prev.y + step + sep };
			else if (dir == "LR") curr = { x: prev.x + sep, y: prev.y + tight * 2 };
			else if (dir == "RU") curr = { x: prev.x + step, y: prev.y - step };
			else if (dir == "RD") curr = { x: prev.x + step, y: prev.y + step + sep };
			else if (dir == "RL") curr = { x: prev.x, y: prev.y + tight * 2 };
			minmax();
		};
		var minmax = function () {
			if (curr.x > max.x) max.x = curr.x;
			if (curr.y > max.y) max.y = curr.y;
			if (curr.x < min.x) min.x = curr.x;
			if (curr.y < min.y) min.y = curr.y;
		};

		ctx.beginPath();
		tip(gesture[0]);
		for (i = 0; i < gesture.length - 1; i++)
			curve(gesture[i] + gesture[i + 1]);
		tip(gesture[gesture.length - 1]);
		ctx.stroke();

		var center = { x: (max.x + min.x) / 2, y: (max.y + min.y) / 2 };
		var wr = (max.x - min.x + step) / width;
		var hr = (max.y - min.y + step) / height;
		var ratio = hr > wr ? hr : wr;
		step = step / ratio;
		sep = sep / ratio;
		tight = tight / ratio;
		if (tight > 6) tight = 6;
		curr = { x: 0, y: 0 };

		ctx.clearRect(0, 0, c.width, c.height);
		ctx.save();
		ctx.translate(width / 2 - center.x / ratio, height / 2 - center.y / ratio);
		ctx.beginPath();
		tip(gesture[0]);
		for (i = 0; i < gesture.length - 1; i++)
			curve(gesture[i] + gesture[i + 1]);
		tip(gesture[gesture.length - 1]);
		ctx.stroke();
		ctx.fillStyle = "rgba(" + settings.trailColor.r + "," + settings.trailColor.g + "," + settings.trailColor.b + "," + settings.trailColor.a + ")";
		ctx.beginPath();
		if (gesture[gesture.length - 1] == "U") { ctx.moveTo(curr.x - 5, curr.y + 2); ctx.lineTo(curr.x + 5, curr.y + 2); ctx.lineTo(curr.x, curr.y - 3); }
		else if (gesture[gesture.length - 1] == "D") { ctx.moveTo(curr.x - 5, curr.y - 2); ctx.lineTo(curr.x + 5, curr.y - 2); ctx.lineTo(curr.x, curr.y + 3); }
		else if (gesture[gesture.length - 1] == "L") { ctx.moveTo(curr.x + 2, curr.y - 5); ctx.lineTo(curr.x + 2, curr.y + 5); ctx.lineTo(curr.x - 3, curr.y); }
		else if (gesture[gesture.length - 1] == "R") { ctx.moveTo(curr.x - 2, curr.y - 5); ctx.lineTo(curr.x - 2, curr.y + 5); ctx.lineTo(curr.x + 3, curr.y); }
		else if (gesture[gesture.length - 1] == "1") { ctx.moveTo(curr.x - 2, curr.y - 6); ctx.lineTo(curr.x + 6, curr.y + 2); ctx.lineTo(curr.x - 2, curr.y + 2); }
		else if (gesture[gesture.length - 1] == "3") { ctx.moveTo(curr.x + 2, curr.y - 6); ctx.lineTo(curr.x - 6, curr.y + 2); ctx.lineTo(curr.x + 2, curr.y + 2); }
		else if (gesture[gesture.length - 1] == "7") { ctx.moveTo(curr.x - 2, curr.y + 6); ctx.lineTo(curr.x + 6, curr.y - 2); ctx.lineTo(curr.x - 2, curr.y - 2); }
		else if (gesture[gesture.length - 1] == "9") { ctx.moveTo(curr.x + 2, curr.y + 6); ctx.lineTo(curr.x - 6, curr.y - 2); ctx.lineTo(curr.x + 2, curr.y - 2); }
		ctx.closePath();
		ctx.fill();
		ctx.restore();

		return c;
	};
	var drawRocker = function (gesture, width) {
		var first = gesture[1] == 'L' ? 0 : (gesture[1] == 'M' ? 1 : 2);
		var second = gesture[2] == 'L' ? 0 : (gesture[2] == 'M' ? 1 : 2);
		return $("<div>").css({ 'width': width + 'px' })
		  .append($("<div>").text(chrome.i18n.getMessage('gesture_' + gesture))
							.css({ "font-size": (.8 * Math.sqrt(width / 100)) + "em", "color": "#111", "text-align": "center", "font-weight": "bold" }))
		  .append($("<div>").text(chrome.i18n.getMessage('gesture_rocker_descrip',
								   [chrome.i18n.getMessage('options_mousebutton_' + first), chrome.i18n.getMessage('options_mousebutton_' + second)]))
							.css({ "font-size": (.8 * Math.sqrt(width / 100)) + "em", "color": "#666", "text-align": "center" }));
	};
	var drawWheel = function (gesture, width) {
		return $("<div>").css({ 'width': width + 'px' })
		  .append($("<div>").text(chrome.i18n.getMessage('gesture_' + gesture))
							.css({ "font-size": (.8 * Math.sqrt(width / 100)) + "em", "color": "#111", "text-align": "center", "font-weight": "bold" }))
		  .append($("<div>").text(chrome.i18n.getMessage('gesture_' + gesture + '_descrip'))
							.css({ "font-size": (.8 * Math.sqrt(width / 100)) + "em", "color": "#666", "text-align": "center" }));
	};
	var codeCharMap = {};
	codeCharMap[8] = "Backspace";
	codeCharMap[9] = "Tab";
	codeCharMap[13] = "Enter";
	codeCharMap[19] = "Pause";
	codeCharMap[20] = "Caps Lock";
	codeCharMap[27] = "Esc";
	codeCharMap[32] = "Space";
	codeCharMap[33] = "Page Up";
	codeCharMap[34] = "Page Down";
	codeCharMap[35] = "End";
	codeCharMap[36] = "Home";
	codeCharMap[37] = "Left";
	codeCharMap[38] = "Up";
	codeCharMap[39] = "Right";
	codeCharMap[40] = "Down";
	codeCharMap[45] = "Insert";
	codeCharMap[46] = "Delete";
	codeCharMap[96] = "NP 0";
	codeCharMap[97] = "NP 1";
	codeCharMap[98] = "NP 2";
	codeCharMap[99] = "NP 3";
	codeCharMap[100] = "NP 4";
	codeCharMap[101] = "NP 5";
	codeCharMap[102] = "NP 6";
	codeCharMap[103] = "NP 7";
	codeCharMap[104] = "NP 8";
	codeCharMap[105] = "NP 9";
	codeCharMap[106] = "NP *";
	codeCharMap[107] = "NP +";
	codeCharMap[109] = "NP -";
	codeCharMap[110] = "NP .";
	codeCharMap[111] = "NP /";
	codeCharMap[144] = "Num Lock";
	codeCharMap[145] = "Scroll Lock";
	codeCharMap[186] = ";";
	codeCharMap[187] = "=";
	codeCharMap[188] = ",";
	codeCharMap[189] = "-";
	codeCharMap[190] = ".";
	codeCharMap[191] = "/";
	codeCharMap[192] = "~";
	codeCharMap[219] = "[";
	codeCharMap[220] = "\\";
	codeCharMap[221] = "]";
	codeCharMap[222] = "'";
	var codeButton = function (code) {
		var code = code.split(":");
		var id = code[1];
		var key = code[2];
		if (!id || id == "") return "empty";
		if (id.substr(0, 2) != "U+") return id;
		var ch = codeCharMap[key]; if (ch) return ch;
		return eval("\"\\u" + id.substr(2) + "\"");
	};
	var drawKey = function (gesture, width) {
		return $("<div>").css({ 'width': width + 'px' })
		  .append($("<div>").text((gesture[1] == "1" ? "Ctrl + " : "") + (gesture[2] == "1" ? "Alt + " : "") + (gesture[3] == "1" ? "Shift + " : "") + (gesture[4] == "1" ? "META + " : "") + codeButton(gesture))
							.css({ "font-size": (.8 * Math.sqrt(width / 100)) + "em", "color": "#666", "text-align": "center", "font-weight": "bold" }));
	};


	var messageNode = null;
	var insertMessage = function (message) {
		document.title = message + " " + document.title;
		var mess = document.createElement("span");
		mess.innerHTML = message + " ";
		if (!messageNode) {
			messageNode = document.createElement("div");
			document.body.appendChild(messageNode);
			messageNode.style.width = document.width;
			messageNode.style.position = "absolute";
			messageNode.style.top = "0";
			messageNode.style.left = "0";
			messageNode.style.zIndex = "1000";
			messageNode.style.display = "block";
			messageNode.style.backgroundColor = "white";
			messageNode.appendChild(mess);
		} else {
			messageNode.insertBefore(mess, messageNode.firstChild);
		}
	};


	///////////////////////////////////////////////////////////
	// Enable/Disable /////////////////////////////////////////
	///////////////////////////////////////////////////////////
	var init = function () {
		window.addEventListener('focus', focusCapture, true);
		window.addEventListener('blur', blurCapture, true);

		_this.connect();

		canvas = document.createElement("canvas");
		if (canvas.style) {
			canvas.style.position = "fixed";
			canvas.style.top = 0;
			canvas.style.left = 0;
			canvas.style.zIndex = 10001;
		}
		canvasResize();

		htmlclear = document.createElement("div");
		if (htmlclear.style) {
			htmlclear.style.clear = "both";
		}
	};

	var enable = function () {
		if (enabled) return;
		enabled = true;

		window.addEventListener('mousedown', mouseDownCapture, true);
		window.addEventListener('mouseup', mouseUpCapture, true);
		window.addEventListener('click', mouseClickCapture, true);
		window.addEventListener('contextmenu', doContextMenu, true);
		window.addEventListener("selectstart", doSelectStart, true);
		window.addEventListener('resize', canvasResize, true);
		window.addEventListener('keydown', keyDownCapture, true);
	};

	_this.disable = function () {
		if (!enabled) return;
		enabled = false;

		window.removeEventListener('mousedown', mouseDownCapture, true);
		window.removeEventListener('mouseup', mouseUpCapture, true);
		window.removeEventListener('click', mouseClickCapture, true);
		window.removeEventListener('contextmenu', doContextMenu, true);
		window.removeEventListener("selectstart", doSelectStart, true);
		window.removeEventListener('resize', canvasResize, true);
		window.removeEventListener('keydown', keyDownCapture, true);

		port.onMessage.removeListener(receiveMessage);
		port.onDisconnect.removeListener(_this.disable);
	};

	_this.enabled = function () {
		return enabled;
	};
	_this.extVersion = function () {
		return extVersion;
	};
	_this.setSettings = function (s) {
		settings = s;
	};

	init();
};


if (window.SGinjectscript && window.SGinjectscript.constructor == HTMLScriptElement) {
	var match = window.SGinjectscript.src.match(/([^a-p]|^)([a-p]{32})([^a-p]|$)/);
	if (match) window.SGextId = match[2];
	var scripts = document.querySelectorAll("script[src^=chrome-extension\\:\\/\\/]");
	for (var i = 0; i < scripts.length; i++) scripts[i].parentNode.removeChild(scripts[i]);
}


if (window.SG) {
	if (!window.SG.enabled()) window.SG.connect();
} else {
	window.SG = new SmoothGestures();
}





