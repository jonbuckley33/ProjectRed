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
		this.skin.rotation = this.body.GetBody().GetAngle() * (180 / Math.PI);

		//update position
		screenPos = camera.worldToScreen(this.body.GetBody().GetPosition());
		this.skin.x = screenPos.x;
		this.skin.y = screenPos.y;

		//update scale
		var scale = camera.getScale();
		this.skin.scaleX = this.skin.scaleY = scale;

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
		/*if (this.skin.currentAnimation != str) {
			this.skin.gotoAndPlay(str);
		}*/
	};

	//this will help us associate the box2d obj with the actor
	this.body.SetUserData(this);

	this.setupMouseEvents = function(camera) {
		//sets up mouse events
		this.skin.on("mousedown", function(evt) {
			//sleep, child
			body.GetBody().SetAwake(false);
		});

		this.skin.on("pressmove", function(evt) {
			//drag and drop the dude
	    	body.GetBody().SetPosition(camera.screenToWorld(evt.stageX,evt.stageY));
	    	body.GetBody().SetAwake(false);
		});
			
		this.skin.on("pressup", function(evt) {
	   		//wake him up
	    	body.GetBody().SetAwake(true);
	    	body.GetBody().SetSleepingAllowed(true);
		});
	}
	
}