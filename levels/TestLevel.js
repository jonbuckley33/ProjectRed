{
	"name" : "TestLevel",
	"staticActors" : [
		{ // ground
			"name" : "ground",
			"position" : {"x" : 0, "y": 8},
			"shape" : {
						"type" : "rect",
					  	"width" : 5,
					  	"height" : 1
					  }
		}
	] ,
	"dynamicActors" : [
		{ //ball!
			"name" : "ball",
			"position" : {"x" : 1, "y" : 1},
			"shape" : {
						"type" : "circ",
						"radius" : 1
					  }
		}
	]
}