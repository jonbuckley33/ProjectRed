/*
	Class : LevelSelect extends Menu

	responsible for giving user ability to select level

	Parameters:
		canvasManager - an instance of the canvasmanager
		functions - list of callback functions
*/
function LevelSelect(canvasManager, functions) {
	this.show = function() {
		var camera = new Camera(new b2Vec2(500, 300), 1000, 600);

		//load the level
		LevelLoader.load("TestLevel.json", function(level) {
			level.camera = camera;
			functions.continueFunction(level);
		}, canvasManager, camera);
	};

	this.hide = function() {

	};
}