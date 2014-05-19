function debug() {
	//debugger wrapper	
}

//global variable for turning on and off debug output
var DEBUG_ENABLED = true;
debug.log = function(str) {
	if (DEBUG_ENABLED) {
		console.log(str);
	}
}