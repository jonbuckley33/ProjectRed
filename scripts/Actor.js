function Actor(skin, body)
{
	/* copied from online */
	this.body = body;
	this.body.GetBody().SetUserData(this);
	this.skin = skin;
	this.isHero = false;
	this.classes = [];

	this.update = function() { // translate box2d positions to pixels
		this.skin.rotation = this.body.GetBody().GetAngle() * (180 / Math.PI);
		this.skin.x = Converter.gameToCanvas(this.body.GetBody().GetPosition().x);
		this.skin.y = Converter.gameToCanvas(this.body.GetBody().GetPosition().y);
	};

	//this will help us associate the box2d obj with the actor
	this.body.SetUserData(this);
}