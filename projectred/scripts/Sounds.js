function Sounds(){

	this.manifest  = [
    	{id:"background", src:"sounds/backgroundMusic.mp3"}
	];
	createjs.Sound.alternateExtensions = ["mp3"];
	createjs.Sound.addEventListener("fileload", handleLoad);
    this.loaded = createjs.Sound.registerManifest(this.manifest, "");
    function handleLoad(event) {
    	debug.log(event.id + " loaded");
	}
    this.soundStatus = {"background" : false}


	this.playSound = function(id,looping){
		if(looping){
			this.soundStatus[id] = true;
		}
		var sound = createjs.Sound.play(id);

		sound.addEventListener("complete", handleComplete);
		function handleComplete(event){
			if(this.soundStatus[id])Sounds.playSound(id,false);
		}

		sound.addEventListener("failed", handleFailed);
		function handleFailed(event){
			debug.log(event.id + " not loaded");
		}

	}

	this.stopLooping = function(id){
		this.soundStatus[id] = false;
	}
}

