function Actor(skin, body)
{
	/* copied from online */
	this.body = body;
	this.skin = skin;
	this.update = function() { // translate box2d positions to pixels
		this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
		this.skin.x = this.body.GetWorldCenter().x * SCALE;
		this.skin.y = this.body.GetWorldCenter().y * SCALE;
	}

	//this will help us associate the box2d obj with the actor
	body.SetUserData(this);
}