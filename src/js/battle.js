(function() {
	var my = {
		islands: [],
		islandsNr: 0,
		minPopBeforeHumanAttack: 50, //minimum population for all computer islands before attacking human
		determineClosestIsland: function() {
			var i,
				pos,
				ownIslands;
			my.islands = IB.Island.getLoc();
			islandsNr = my.islands.length;
			ownIslands = IB.Island.getComputerIslands();
			if (ownIslands.length > 0) {
				for (i = 0; i < islandsNr; i = i + 1) {
					//TODO: continue from here ... we need computer target(s)
				}
			}
		},
		init: function() {
			console.log("computer ready for action");
			my.determineClosestIsland();
		},
		testReady: function() {
			var isReady,
				retry = true;
			if (IB && IB.Island) {
				isReady = IB.Island.ready();
				if (isReady) {
					retry = false;
					my.init();
				}
			}
			if (retry) {
				setTimeout(function() { my.testReady(); }, 200);
			}
		}
	},
	Computer = (function() {
		return {
			init: my.init,
			testReady: my.testReady
		}
	}());
	Computer.testReady();
	window.IB.Computer = Computer;
}());