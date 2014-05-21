function Actor(skin, body)
{
	/* copied from online */
	this.body = body;
	this.body.GetBody().SetUserData(this);
	this.skin = skin;
	this.isHero = false;
	this.classes = [];

	this.update = function(camera) { // translate box2d positions to pixels
		this.skin.rotation = this.body.GetBody().GetAngle() * (180 / Math.PI);
		screenPos = camera.worldToScreen(this.body.GetBody().GetPosition());
		this.skin.x = screenPos.x;
		this.skin.y = screenPos.y;
		var scale = camera.getScale();
		this.skin.scaleX = this.skin.scaleY = scale;
	};

	this.setAnimation = function(str) {
		if (this.skin.currentAnimation != str) {
			this.skin.gotoAndPlay(str);
		}
	};

	//this will help us associate the box2d obj with the actor
	this.body.SetUserData(this);
}