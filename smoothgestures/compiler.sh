#!/bin/sh
java -jar compiler.jar --js jso/background.js --js_output_file js/background.js
java -jar compiler.jar --js jso/bsync.scrypt.b64.ls.js --js_output_file js/bsync.scrypt.b64.ls.js
java -jar compiler.jar --js jso/define.js --js_output_file js/define.js
java -jar compiler.jar --js jso/background_pn.js --js_output_file js/background_pn.js
java -jar compiler.jar --js jso/helpers.js --js_output_file js/helpers.js
java -jar compiler.jar --js jso/contentscript.js --js_output_file js/contentscript.js
java -jar compiler.jar --js jso/gestures.js --js_output_file js/gestures.js
java -jar compiler.jar --js jso/options.js --js_output_file js/options.js
java -jar compiler.jar --js jso/pluginstorage.js --js_output_file js/pluginstorage.js
java -jar compiler.jar --js jso/popup.js --js_output_file js/popup.js
java -jar compiler.jar --js jso/status.js --js_output_file js/status.js
java -jar compiler.jar --js jso/translate.js --js_output_file js/translate.js

