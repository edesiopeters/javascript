// This function will be called when the user taps within
 // the web component.  Call by onclick method attached to element
 execAction = function(action,val) {
 // Raise an action
    gICAPI.SetFocus();
    gICAPI.SetData(val);
    gICAPI.Action(action);    
 }

 // This function is called by the Genero Client Container
 // so the web component can initialize itself and initialize
 // the gICAPI handlers
 onICHostReady = function(version) {
    var toolong;
    if ( version != 1.0 )
       alert('Invalid API version');
 
    // Called by webcompnent frontcall to alter the HTML of the
    // document
    setById = function(id, value) {
        document.getElementById(id).innerHTML=value;
    }

    // Initialize the focus handler called by the Genero Client
    // Container when the DVM set/remove the focus to/from the
    // component
    gICAPI.onFocus = function(polarity) {
    }
    
    // When the user click on the document we ask the DVM to
    // get the focus
    askFocus = function() {
       gICAPI.SetFocus();
    }
    
 }