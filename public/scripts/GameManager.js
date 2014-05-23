function GameManager()
{
	//reference to CanvasManager instance (which contains the EaselJs stage)
	var canvasManager; 

	//continue data pertaining to built game
	var gameData = {};

	function initialize() {
		canvasManager = new CanvasManager("mainCanvas");

		//store reference later
		gameData.canvasManager = canvasManager;

		//go to startscreen
		startScreen();
	}

	function startScreen() {
		/*//construct start screen and show it
		var startScreen = new StartScreen(
			{
				//when user clicks continue, hide start screen, continue
				startGame : function() {
					startScreen.hide(canvasManager);
					signIn();
				}
			});
		startScreen.init(canvasManager, function() {startScreen.show(canvasManager)});*/
		signIn();
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