function GameManager()
{
	//reference to CanvasManager instance (which contains the EaselJs stage)
	var canvasManager; 

	//continue data pertaining to built game
	var gameData = {};

	var assetQueue;

	var loadBar, loadMask, loadBg;

	function initialize() {
		canvasManager = new CanvasManager("mainCanvas");

		//store reference later
		gameData.canvasManager = canvasManager;

		//start loading stuff
		//startScreen();
		createLoadingBar();
	}

	function createLoadingBar() {
		loadBg = new createjs.Bitmap("images/load_bg.jpg");
		loadBg.x = canvasManager.getCanvasWidth / 2;
		loadBg.y = canvasManager.getCanvasHeight / 2;
		canvasManager.stage.addChild(loadBg);

		var loadSheet = new createjs.SpriteSheet({
			images: ["images/loadbar.png"],
			frames: {width: 125, height: 30, regX: 62.5, regY: 0},
			animations: {
				load: [0, 16, "load"]
			}
		})
		loadBar = new createjs.Sprite(loadSheet, "load");
		loadBar.x = loadBg.x;
		loadBar.y = loadBg.y;
		loadBar.gotoAndPlay("load");
		canvasManager.stage.addChild(loadBar);

		loadMask = new createjs.Shape();

		canvasManager.update();
		loadResources();
	}

	function loadResources() {
		//instantiate pipeline
		assetQueue = new createjs.LoadQueue();

		//setup progress bar updater, and complete handler
		assetQueue.on("progress", progress);
		assetQueue.on("complete", loadingComplete);

		//load initial manifest
		assetQueue.loadManifest("manifests/initialManifest.json");
	}

	function progress(e) {
		var percent = e.loaded;
		loadMask.graphics.beginFill("black").drawRect(0, 0, percent*125, 30);
		loadMask.cache(0, 0, 125, 30);
		loadBar.filters = [
			new createjs.AlphaMaskFilter(loadMask.cacheCanvas)
		];
		loadBar.cache(0, 0, 125, 30);
		canvasManager.update();
	}

	function loadingComplete()
	{
		destroyLoadingBar();
		startScreen();
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