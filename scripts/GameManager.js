function GameManager()
{
	//enum representing all of the game states
	var gameState = {
		INITIALIZING : {value : 0, name : "Initializing", code: "I"},
		RUNNING : {value : 1, name : "Running", code : "R"},
		PAUSED : {value : 2, name : "Paused", code : "P"},
		GAME_OVER : {value : 3, name : "Game Over", code : "G"}
	};

	//set the state initially to INITIALIZING
	var state = gameState.INITIALIZING;
	var canvasManager; 

	var actors = [];

	this.init = function(canvasManager)
	{
		this.canvasManager = canvasManager;
		createjs.Ticker.addEventListener("tick", this.run);
	};

	this.run = function()
	{
		switch (state)
		{
			case gameState.INITIALIZING:
				this.state = gameState.RUNNING;
				break;

			case gameState.RUNNING:
				break;

			case gameState.PAUSED: 
				break;

			case gameState.GAME_OVER:
				break;
		};
	}

	this.pause = function()
	{
		this.state = gameState.PAUSED;
	};
}