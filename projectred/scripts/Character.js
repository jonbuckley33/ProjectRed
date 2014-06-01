function Character(skin, body) {
	this.__proto__ = new GameObject(skin, body);
	
	this.run = function(camera, world, timestep) {

	};
}

Character.Hydrate = function(charDef, world, camera, canvasManager, assetQueue) {
	Character.__proto__.Hydrate()
};