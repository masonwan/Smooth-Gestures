


//localStorage access
var lscache = {};
var ls = function(name, val, init) {
  if(val === undefined) {
    if(lscache[name]) return lscache[name];
    try {
      lscache[name] = JSON.parse(localStorage.getItem(name));
      return lscache[name];
    } catch(e) {}
    return null;
  }
  if(init && ls(name)) return;
  lscache[name] = JSON.stringify(val);
  localStorage.setItem(name, lscache[name]);
  lscache[name] = JSON.parse(lscache[name]);
}







//base64
var Base64 = {};
Base64.map = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
              'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
              '0','1','2','3','4','5','6','7','8','9','+','/'];
Base64.fromBinArray = function(arr) {
  var str = "";
  for(var i=0; i+2<arr.length; i+=3) {
    var n = arr[i]*256*256+arr[i+1]*256+arr[i+2];
    str += Base64.map[Math.floor(n/64/64/64)];
    str += Base64.map[Math.floor(n/64/64)%64];
    str += Base64.map[Math.floor(n/64)%64];
    str += Base64.map[Math.floor(n)%64];
  }
  var x = arr.length%3;
  if(x > 0) {
    var r = arr.length - x;
    var n = arr[r]*256*256+(x==2?arr[r+1]*256:0);
    str += Base64.map[Math.floor(n/64/64/64)];
    str += Base64.map[Math.floor(n/64/64)%64];
    if(x==2)
      str += Base64.map[Math.floor(n/64)%64] + "=";
    else
      str += "==";
  }
  return str;
}
Base64.toBinArray = function(str) {
  var arr = [];
  var eq = str.indexOf("="); if(eq>=0) str = str.substr(0,eq);
  for(var i=0; i+3<str.length; i+=4) {
    var n = Base64.map.indexOf(str[i])*64*64*64
           +Base64.map.indexOf(str[i+1])*64*64
           +Base64.map.indexOf(str[i+2])*64
           +Base64.map.indexOf(str[i+3]);
    arr.push(Math.floor(n/256/256));
    arr.push(Math.floor(n/256)%256);
    arr.push(Math.floor(n)%256);
  }
  var x = str.length%4;
  if(x > 0) {
    var r = str.length - x;
    var n = Base64.map.indexOf(str[r])*64*64*64
           +Base64.map.indexOf(str[r+1])*64*64
           +(x==3 ? Base64.map.indexOf(str[r+2])*64 : 0)
    arr.push(Math.floor(n/256/256));
    if(x==3)
      arr.push(Math.floor(n/256)%256);
  }
  return arr;
}
Base64.fromString = function(str) {
  var arr = [];
  for(var i=0; i<str.length; i++) arr.push(str.charCodeAt(i));
  return Base64.fromBinArray(arr);
}
Base64.toString = function(str) {
  var arr = Base64.toBinArray(str);
  str = "";
  for(var i=0; i<arr.length; i++) str += String.fromCharCode(arr[i]);
  return str;
}







//encoding [depends: Base64]
var SimpleCrypt = {};
SimpleCrypt.encode = function(str, key) {
  if(!key) return Base64.fromString(str);
  key = Base64.toBinArray(key);
  var s = key[0]; var cyp = [];
  for(var i=0; i<str.length; i++) cyp.push((str.charCodeAt((i+s)%str.length)+key[i%key.length])%256);
  return Base64.fromBinArray(cyp);
}
SimpleCrypt.decode = function(str, key) {
  if(!key) return Base64.toString(str);
  key = Base64.toBinArray(key);
  var cyp = Base64.toBinArray(str);
  var s = key[0]; var pla = "";
  for(var i=0; i<cyp.length; i++) pla += String.fromCharCode((cyp[(i+cyp.length*256-s)%cyp.length]-key[(i+cyp.length*256-s)%cyp.length%key.length]+256)%256);
  return pla;
}
SimpleCrypt.makeKey = function(pass) {
  if(typeof pass == "string") {
    var b64 = Base64.fromString(pass);
    var eq = b64.indexOf("="); if(eq>=0) b64 = b64.substr(0,eq);
    b64 = Base64.fromString(b64);
    eq = b64.indexOf("="); if(eq>=0) b64 = b64.substr(0,eq);
    b64 = b64.substr(1);
    if(b64.length%4==1) b64.substr(1);
    if(b64.length%4==2) b64 += "==";
    if(b64.length%4==3) b64 += "=";
    return b64;
  } else {
    var len = 10+Math.floor(Math.random()*20);
    var arr = [];
    for(var i=0; i<len; i++) arr.push(Math.floor(Math.random()*256));
    return Base64.fromBinArray(arr);
  }
}









