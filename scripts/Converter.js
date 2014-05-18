function Converter()
{
	var oneMeter = 50; //pixels
	this.gameToCanvas = function(x)
	{
		return x * oneMeter;
	}	

	this.canvasToGame = function(x)
	{
		return x / oneMeter;
	}
}