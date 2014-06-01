function Timer(){
	
	this.time = new Date();
	this.initTime = this.time.getTime();

	this.elapsedTime = function(){
		this.time = new Date();
		return (this.time.getTime() - this.initTime);
	}

	this.resetTime = function(){
		this.initTime = this.time.getTime();
	}
}


