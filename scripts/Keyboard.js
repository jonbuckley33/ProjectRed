function Keyboard()
{
	//responsible for keyinput handling
}

var W = 119;
var A = 97;
var S = 115;
var D = 100;

var I = 105;
var J = 106;
var K = 107;
var L = 108;

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
		cm - canadian movement function

	Returns:
		void

	See Also:
		<updateMovement>

*/
Keyboard.bind = function(hm, cm)
{
	$(document).keypress(function (e) {
		//a key was hit that we care about
		if ($.inArray(e.which, eventKeys) > -1 && keyDown == -1) {
			keyDown = e.which;

			//update movement every 50 ms
			repeatUpdateMovement = setInterval(function () {updateMovement(hm)}, 50);
		}
		
	});

	$(document).keyup(function (e) {
		//a key was hit that we care about
		if ($.inArray(e.which), eventKeys) {
			keyDown = -1;
			
			//stop updating movement 
			clearInterval(repeatUpdateMovement);
		}
	});
};
