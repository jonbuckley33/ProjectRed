function Actor(skin, body)
{
	var converter = new Converter();

	/* copied from online */
	this.body = body;
	this.skin = skin;
	this.update = function() { // translate box2d positions to pixels
		this.skin.rotation = this.body.GetBody().GetAngle() * (180 / Math.PI);
		this.skin.x = converter.gameToCanvas(this.body.GetBody().GetPosition().x);
		this.skin.y = converter.gameToCanvas(this.body.GetBody().GetPosition().y);
	};

	//this will help us associate the box2d obj with the actor
	this.body.SetUserData(this);
}