/*
	Class : LevelSelect extends Menu

	responsible for giving user ability to select level

	Parameters:
		canvasManager - an instance of the canvasmanager
		functions - list of callback functions
*/
function LevelSelect(canvasManager, functions) {
	this.show = function() {
		var camera = new Camera(
		new b2Vec2(12, 6), 
		{width : 24, height: 12}, 
		{
		left : 0,
		right : 30,
		top : 0,
		bottom : 15
		});
		//load the level
		LevelLoader.load("TestLevel.json", function(level) {
			level.camera = camera;
			functions.continueFunction(level);
		}, canvasManager, camera);
	};

	this.hide = function() {

	};
}