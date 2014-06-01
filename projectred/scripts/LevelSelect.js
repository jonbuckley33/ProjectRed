/*
	Class : LevelSelect extends Menu

	responsible for giving user ability to select level

	Parameters:
		canvasManager - an instance of the canvasmanager
		functions - list of callback functions
*/
function LevelSelect(canvasManager, functions) {
	this.show = function() {
		//load the level
		LevelLoader.load("TestLevel.json", function(level) {
			functions.continueFunction(level);
		});
	};

	this.hide = function() {

	};
}