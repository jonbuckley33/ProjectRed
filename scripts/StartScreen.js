/*
	Class : StartScreen

	Responsible for displaying a start screen

	Parameters:
		canvasManager - an instance of CanvasManager
		functions - list of callbacks
*/
function StartScreen(canvasManager, functions) {

	this.show = function() {
		//temporary
		functions.continueFunction();	
	};

	this.hide = function() {

	};
	
}