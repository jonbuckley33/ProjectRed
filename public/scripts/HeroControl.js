/*	
	Class : HeroControl

	contains movement controls of hero

	Parameters:
		hero - the hero to control
*/
function HeroControl(hero) {
	//max (absolute) speed of hero
	var maxSpeed = {x : 3.0, y : 10.0};
	//max increment at any given time of velocity
	var maxIncrement = { x : 2.0, y : 2.0};
	//scalar multiplied against vector
	var movementScalar = .5;
	
	/*
		Function : heroMove

		moves the hero 

		Parameters:
			dirX - the magnitude of movement in x direction
			dirY - the magnitude of movement in y direction

		Returns:
			void
	*/
	this.heroMove = function(dirX,dirY)
	{		
		var changeX, changeY;
		changeX = changeY = 0.0;
		
		var velocity = hero.body.GetBody().GetLinearVelocity();
		
		//calculates impulse if moving laterally
		if (dirX != 0) {
			var diff;
			if (dirX > 0) {
				diff = maxSpeed.x - velocity.x;
				diff = (Math.abs(diff) > maxIncrement.x) ? maxIncrement.x : diff;
			} else {
				diff = -maxSpeed.x - velocity.x;
				diff = (Math.abs(diff) > maxIncrement.x) ? -maxIncrement.x : diff;
			}

			changeX = diff;
		} 

		//calculates impulse if moving vertically
		else if (dirY != 0) {
			var diff;
			if (dirY < 0) {
				diff = -maxSpeed.y - velocity.y;
				diff = (Math.abs(diff) > maxIncrement.y) ? -maxIncrement.y : diff;
				//diff = -maxIncrement.y;
			} else {
				//diff = maxSpeed - velocity.y;
				//diff = (Math.abs(diff) > maxIncrement.y) ? maxIncrement.y : diff;
				diff = maxIncrement.y;
			}

			changeY = diff;
		}

		//apply impulse
		hero.body.GetBody().ApplyImpulse(
			new b2Vec2(movementScalar*changeX, movementScalar*changeY),
			hero.body.GetBody().GetWorldCenter());	

		//update animation
		/*if (dirX < 0){
			hero.setAnimation("walkl");
		}else if (dirX > 0){
			hero.setAnimation("walkr");
		}else{
			hero.setAnimation("idle");
		}*/
	};

	/*
		Function : heroStop 

		stops the hero's movement

		Returns: 
			void

	*/
	this.heroStop = function() {
		//get velocity of hero
		var velocity = hero.body.GetBody().GetLinearVelocity();

		//we aim to cancel it completely
		var inverse = new b2Vec2(-velocity.x, 0);

		//apply impulse
		hero.body.GetBody().ApplyImpulse(
			inverse,
			hero.body.GetBody().GetWorldCenter());	

		//chill out our hero
		//hero.setAnimation("idle");
	};
}