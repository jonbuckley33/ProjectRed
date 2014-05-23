/*
	Class : ParallaxBackground

	creates effect of parallax for a background image

	Parameters:
		img - the image to parallax
		stageLength - the length of the stage, in meters
*/
function ParallaxBackground(img, camera) {
	this.img = img;
	this.img.x = 0;
	this.img.y = 0;

	debug.log("background image")
	debug.log(this.img)
	this.update = function(camera) {
		//get bounds of camera
		var bounds = this.img.getBounds();
		if (bounds != undefined) {
			var stageLengthPixels = (camera.bounds.right - camera.bounds.left) 
				* camera.oneMeter(); //meters to pixels
			var stageHeightPixels = (camera.bounds.bottom - camera.bounds.top)
				* camera.oneMeter();

			//scale image to be exactly as long as the camera can see
			var scaleX = stageLengthPixels / bounds.width;
			var scaleY = stageHeightPixels / bounds.height;
			this.img.scaleX = scaleX; 
			this.img.scaleY = scaleY;

			var origin = camera.worldToScreen(new b2Vec2(camera.bounds.left, 
				camera.bounds.top));

			//put img at top-left of stage 
			this.img.x = origin.x;	
			this.img.y = origin.y;
		}
		
	}
	
}