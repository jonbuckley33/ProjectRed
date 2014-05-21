function Keyboard()
{
	
}

var W = 87;
var A = 65;
var S = 83;
var D = 68;

var I = 73;
var J = 74;
var K = 75;
var L = 76;

var U = 85;
var O = 79;

var keyDown = [];
var eventKeys = [W, A, S, D];
var repeatUpdateMovement = [];

/* 
	Function : updateMovement

	instructs gamemanager to handle hero movement

	Parameters:
		hm - hero movement function responsible for updating hero

	Returns: 
		void
*/
function updateMovement(hm) {
	for (var i = 0; i < keyDown.length; i++) {
		var key = keyDown[i];
		switch(key) {
			case W:
				hm(0,-1);
				break;
			case A:
				hm(-1,0);
				break;
			case S:
				hm(0,1);
				break;
			case D:
				hm(1,0);
				break;
			default:
				break;
		}	
	}
}

/*
	Function : Keyboard.bind

	Binds keypresses to event handlers

	Parameters:
		controls - dict containing contorl functions
		cam - camera instance

	Returns:
		void

	See Also:
		<updateMovement>

*/
Keyboard.bind = function(controls, cam)
{
	var hm = controls.heroMove;
	var stop = controls.heroStop;

	$(document).keydown(function (e) {
		//a key was hit that we care about
		if ($.inArray(e.which, eventKeys) > -1 && $.inArray(e.which, keyDown) < 0) {
			keyDown.push(e.which);

			//update movement every 50 ms
			var repeatMovement = setInterval(function () {
				updateMovement(hm);
			}, 50);
			
			//keep track of these calls
			repeatUpdateMovement.push({
				key : e.which,
				interval : repeatMovement
			});

		} else if ($.inArray(e.which, eventKeys) < 0) {
			switch (e.which) {
				case I:
					cam.move(0, -10);
					break;
				case J:
					cam.move(-10, 0);
					break;
				case K:
					cam.move(0, 10);
					break;
				case L:
					cam.move(10, 0);
					break;
				case U:
					cam.zoom(101/100);
					break;
				case O:
					cam.zoom(100/101);
					break;
				default:
					debug.log("The " + e.which + " key was enterred. this key doesn't" +
						"correspond to any action");
					break;
			}
		}
	});

	$(document).keyup(function (e) {
		//a key was hit that we care about
		if ($.inArray(e.which, eventKeys) > -1) {
			var index = keyDown.indexOf(e.which);
			keyDown.splice(index, 1);
			
			//find the function call we want to stop repeating
			index = -1;
			for (var i = 0; i < repeatUpdateMovement.length; i ++) {
				var obj = repeatUpdateMovement[i];

				if (obj.key == e.which) {
					index = i;
					break;
				}
			}

			//stop updating movement 
			clearInterval(repeatUpdateMovement[i]);

			//stop tracking this call
			repeatUpdateMovement.splice(i, 1);

			//if no keys are hit
			if (keyDown.length == 0) {
				setTimeout(function() {
					stop();
					hm(0.0, 0.0);
				}, 100);	
			}
		}
	});
};
