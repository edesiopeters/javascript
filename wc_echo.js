function echoString(str) {
  return str;
}

function echoObject(ostr) {
  var o = JSON.parse(ostr);
  // do something and return back
  return JSON.stringify(o);
}

onICHostReady = function(version) {

   if ( version != 1.0 )
      alert('Invalid API version');

   gICAPI.onProperty = function(p) {
      var myObject = eval('(' + p + ')');
      if (myObject.url!="") {
        setTimeout( function () {
          downloadURL(myObject.url);
        }, 0);
      }
   }

}