function GameManager()
{
	//reference to CanvasManager instance (which contains the EaselJs stage)
	var canvasManager; 

	//continue data pertaining to built game
	var gameData = {};

	var assetQueue;

	//loading bar
	var loadingBar;

	//music
	var sounds;

	function initialize() {
		canvasManager = new CanvasManager("mainCanvas");

		//store reference later
		gameData.canvasManager = canvasManager;

		loadingBar = new LoadingBar();
		loadingBar.init(canvasManager);

		loadResources();
	}

	function loadResources() {
		//instantiate pipeline
		assetQueue = new createjs.LoadQueue();
		assetQueue.installPlugin(createjs.Sound);
		//load music
		sounds = new Sounds();

		//setup progress bar updater, and complete handler
		assetQueue.on("progress", loadingBar.progress);
		assetQueue.on("complete", function() {
			//removes loading bar from screen
			loadingBar.destroy();
			
			//reset listeners
			assetQueue.removeAllEventListeners();

			//proceed to start screen
			startScreen();
		});

		//load initial manifest
		assetQueue.loadManifest("manifests/initialManifest.json");

		assetQueue.loadManifest(sounds.manifest);
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
		startScreen.init(canvasManager, assetQueue, function() {
			startScreen.show(canvasManager)
		});
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

				loadLevel();
			}
		});

		//show level select
		levelSelect.show();
	}

	function loadLevel() {
		//clear the canvas
		canvasManager.clear();

		//show loading bar
		loadingBar.init(canvasManager);

		//setup progress bar updater, and complete handler
		assetQueue.on("progress", loadingBar.progress);
		assetQueue.on("complete", function() {
			//removes loading bar from screen
			loadingBar.destroy();
			
			//reset listeners
			assetQueue.removeAllEventListeners();
			
			//proceed to start screen
			playGame();
		});

		//sounds.playSound("background",false);

		//load initial manifest
		gameData.assetQueue = assetQueue;
		assetQueue.loadManifest("manifests/" + gameData.level.manifestFile);
	}

	function levelEditor() {

	}

	var game;
	function playGame() {
		gameData.gameCompleted = function(postgameReport) {
			//temporary 
			startScreen();
		};

		//construct actual game
		game = new Game(gameData);
		game.start();
	}

	this.getGame = function() {
		return game;
	};

	this.start = function()
	{
		initialize();
	}

	function canvasUpdate() {
		canvasManager.update();
	}
}