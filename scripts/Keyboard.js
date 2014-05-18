function Keyboard()
{
	
}

Keyboard.bind = function(hm)
{
	$(document).on("keypress", function (e) {

		switch(e.which){
			case 119:
				hm(0,-1);
			break;
			case 97:
				hm(-1,0);
			break;
			case 115:
				hm(0,1);
			break;
			case 100:
				hm(1,0);
			break;
			default:
			break;

		}
	});
};

//W = 119
//A = 97
//S = 115
//D = 100