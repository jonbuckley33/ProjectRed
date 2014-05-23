/*
	Class : StartScreen

	Responsible for displaying a start screen

	Parameters:
		functions - list of callbacks
*/
function StartScreen(functions) {

	function loadedCall(data, startScreen) {
		console.log("finished loading");
		console.log('bg:', data.background);
		console.log('buttons', data.buttonsArray);
		startScreen.bg = data.background;
		startScreen.buttons = data.buttonsArray;
		startScreen.loaded = true;
	}

	this.init = function(canvasManager, callback) {
		var self = this;
		Menu.load("StartMenu.json", function(data) {
										loadedCall(data, self);
										callback();
									}, canvasManager, functions);
	}
}

StartScreen.prototype = new Menu();