function Actor(skin, body)
{
	/* copied from online */
	this.body = body;
	this.body.GetBody().SetUserData(this);
	this.skin = skin;
	this.isHero = false;
	this.classes = [];

	var initialUpdate = true;

	/*
		Function : update

		updates the elements of the actor

		Parameters: 
			camera - an instance of the camera

		Returns: 
			void

	*/
	this.update = function(camera) { // translate box2d positions to pixels
		var body = this.body;
		
		//update rotation
		this.skin.setRotation(this.body.GetBody().GetAngle() * (180 / Math.PI));

		//update position
		var worldPos = this.body.GetBody().GetPosition();
		this.skin.setPosition(worldPos.x,worldPos.y);

		//update scale
		var scale = camera.getScale();
		this.skin.setScale(scale);

		if (initialUpdate) {
			this.setupMouseEvents(camera);

			initialUpdate = false;
		}
	};

	/*
		Function : setAnimation

		sets the animation of the actor

		Parameters: 
			str - the name of the animation

		Returns: 
			void

	*/
	this.setAnimation = function(str) {

		if (this.skin.getAnimation() != str) {
			this.skin.setAnimation(str);
		}
	};

	//this will help us associate the box2d obj with the actor
	this.body.SetUserData(this);

	this.setupMouseEvents = function(camera) {
		//sets up mouse events
		this.skin.getSkin().on("mousedown", function(evt) {
			//sleep, child
			body.GetBody().SetAwake(false);
		});

		this.skin.getSkin().on("pressmove", function(evt) {
			//drag and drop the dude
	    	body.GetBody().SetPosition(camera.screenToWorld(evt.stageX,evt.stageY));
	    	body.GetBody().SetAwake(false);
		});
			
		this.skin.getSkin().on("pressup", function(evt) {
	   		//wake him up
	    	body.GetBody().SetAwake(true);
	    	body.GetBody().SetSleepingAllowed(true);
		});
	}
	
}