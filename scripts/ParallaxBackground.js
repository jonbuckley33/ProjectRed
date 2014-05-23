/*
	Class : ParallaxBackground

	creates effect of parallax for a background image

	Parameters:
		img - the image to parallax
		stageLength - the length of the stage, in meters
*/
function ParallaxBackground(img, stageLength) {
	this.img = img;
	this.img.y = 0;

	this.update = function(camera) {
		//get bounds of camera
		var bounds = img.getBounds();
		if (bounds != undefined) {
			var stageLengthPixels = stageLength * 500 * camera.getScale();

			//scale image to be exactly as long as the camera can see
			var scale = bounds.width / stageLengthPixels;
			img.scaleX = img.scaleY = scale; 

			var origin = camera.worldToScreen(new b2Vec2(0, bounds.height/50));
			img.x = origin.x;	
			img.y = origin.y;
		}
		
	}
	
}