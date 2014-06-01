function GameObject(skin, body) {
	this.__proto__ = new Actor(skin, body);
	
	//override 
	this.update = function(camera, world, timestep) {
		//update position, rotation, etc.
		this.__proto__.update(camera, world, timestep);

		this.run(camera, world, timestep);
	};

	//abstract
	this.run = function(camera, world, timestep) {

	};
}
