/*
	Function : CollisionHandler

	handles all collision logic

	Parameters:
		gm - the game manager instance

	Returns:
		an instance of CollisionHandler

*/
function CollisionHandler(game) {
	var game = game;

	this.PreSolve = function(e) {};
	this.BeginContact = function(e){
		var actorA = e.m_fixtureA.GetUserData();
		var actorB = e.m_fixtureB.GetUserData();

		resolve(actorA, actorB);
	};
	this.EndContact = function(e){};
	this.PostSolve = function(e){};

	/* 
		Function: resolve

		decides what the consequence of two actors colliding is

		Parameters: 
			actorA - the first actor colliding
			actorB - the second actor colliding

		Returns: 
			a consequence to the world
	*/
	function resolve(actorA, actorB) {
		//one of them is hero (we will assume they both aren't)
		if (actorA.isHero || actorB.isHero) {
			if ($.inArray("end", actorA.classes) > -1 || 
				$.inArray("end", actorB.classes) > -1) {

				//player wins
				game.pause();
			}
		}
	}
}




