function GameManager()
{
	//reference to CanvasManager instance (which contains the EaselJs stage)
	var canvasManager; 

	//continue data pertaining to built game
	var gameData = {};
	var loadingBar = new LoadingBar();

	function initialize() {
		canvasManager = new CanvasManager("mainCanvas");

		//store reference later
		gameData.canvasManager = canvasManager;

		//start loading stuff
		startScreen();
		/*loadingBar.init(canvasManager);
		createjs.Ticker.addEventListener("tick", function() {
												 	loadingBar.progress({loaded:0.5});
										 		 });*/
	}

	function loadResources() {

	}

	function destroyLoadingBar() {
		canvasManager.stage.removeChild(loadBg);
		canvasManager.stage.removeChild(loadBar);
	}

	function canvasUpdate() {
		canvasManager.update();
	}

	function startScreen() {
		//construct start screen and show it
		var startScreen = new StartScreen(
			{
				//when user clicks continue, hide start screen, continue
				startGame : function() {
					startScreen.hide(canvasManager);
					createjs.Ticker.removeEventListener("tick", canvasUpdate);
					signIn();
				},

				otherFunction: function() {
					debug.log("Another button");
				}
			});
		startScreen.init(canvasManager, function() {startScreen.show(canvasManager)});
		createjs.Ticker.addEventListener("tick", canvasUpdate);
	}

	function signIn() {
		modeSelect();
	}

	function modeSelect() {
		matchmake();
	}

	function matchmake() {
		heroSelect();
	}

	function heroSelect() {
		//construct hero select screen
		var heroSelect = new HeroSelect(canvasManager, {
			continueFunction : function(heroMaker) {
				//save hero, hide selection screen
				gameData.heroMaker = heroMaker;
				heroSelect.hide();

				sync();
			}
		});

		//show hero select screen
		heroSelect.show();
	}

	function sync() {
		levelSelect();
	}

	function levelSelect() {
		//construct level select screen
		var levelSelect = new LevelSelect(canvasManager, {
				continueFunction : function(level) {
				//save level, hide selection screen
				gameData.level = level;
				levelSelect.hide();

				playGame();
			}
		});

		//show level select
		levelSelect.show();
	}

	function levelEditor() {

	}

	function playGame() {
		gameData.gameCompleted = function(postgameReport) {
			//temporary 
			startScreen();
		};

		//construct actual game
		var game = new Game(gameData);
		game.start();
	}

	this.start = function()
	{
		initialize();
	}
}