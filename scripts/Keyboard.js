function Keyboard()
{
	//responsible for keyinput handling
}

var W = 87;
var A = 65;
var S = 83;
var D = 68;

var I = 105;
var J = 106;
var K = 107;
var L = 108;

var U = 117;
var O = 111;

var keyDown = -1;
var eventKeys = [W, A, S, D];
var repeatUpdateMovement;

/* 
	Function : updateMovement

	instructs gamemanager to handle hero movement

	Parameters:
		hm - hero movement function responsible for updating hero

	Returns: 
		void
*/
function updateMovement(hm) {
	switch(keyDown) {
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

/*
	Function : Keyboard.bind

	Binds keypresses to event handlers

	Parameters:
		hm - hero movement function
		cam - a camera instance
		cm - canadian movement function

	Returns:
		void

	See Also:
		<updateMovement>

*/
Keyboard.bind = function(hm, cam, cm)
{
	$(document).keydown(function (e) {
		//a key was hit that we care about
		if ($.inArray(e.which, eventKeys) > -1 && keyDown == -1) {
			keyDown = e.which;

			//update movement every 50 ms
			repeatUpdateMovement = setInterval(function () {
				updateMovement(hm);
			}, 50);
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
					cam.zoom(1001/1000);
					break;
				case O:
					cam.zoom(1000/1001);
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
			keyDown = -1;
			
			//stop updating movement 
			clearInterval(repeatUpdateMovement);
			//hm(0.0, 0.0);
		}
	});
};
