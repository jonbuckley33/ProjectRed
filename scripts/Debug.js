function debug() {
	//debugger wrapper	
}


var DEBUG_ENABLED = true;
debug.log = function(str) {
	if (DEBUG_ENABLED) {
		console.log(str);
	}
}