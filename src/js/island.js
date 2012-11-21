(function () {
	var my = {
		w: 0,
		h: 0,
		cX: [],
		cY: [],
		cR: 48,
		minRad: 16,
		maxRad: 50,
		inslandsNr: 10,
		islands: [],
		ratioDraw: 1,
		growSpeed: 4,
		startLocationIndex: -1,
		computerIslands: [],
		computerReady: false,
		generateRandomDim: function () {
			return Math.round(my.minRad + Math.random() * (my.maxRad - my.minRad));
		},
		calculateIslandCoords: function (n) {
			my.cX[n] = Math.round((Math.random() * (my.w - my.cR * 2))) + my.cR;
			my.cY[n] = Math.round((Math.random() * (my.h - my.cR * 2))) + my.cR;
		},
		measureDistance: function (n) {
			var i,
				dX,
				dY,
				distanceQ,
				dMinQ = Math.pow(my.cR * 2, 2);
			dMinQ = Math.pow(my.cR * 2, 2);
			for (i = 0; i < n; i = i + 1) {
                dX = my.cX[n] - my.cX[i];
                dY = my.cY[n] - my.cY[i];
                distanceQ = Math.round(Math.pow(dX, 2) + Math.pow(dY, 2));
                if (distanceQ < dMinQ) {        
                	my.calculateIslandCoords(n);
                    i = 0;                    
                    dX = my.cX[n] - my.cX[i];
                    dY = my.cY[n] - my.cY[i];
                    distanceQ = Math.round(Math.pow(dX, 2) + Math.pow(dY, 2));
                    i = i - 1;
                }
            }
		},
		updateIslandVal: function (islandEl, island) {
			/**
			 * @description Update island population
			 */
			islandEl = islandEl || null;
			if (!islandEl) {
				islandEl = document.getElementById("island" + island.index);
			}
			islandEl.innerHTML = island.val;
		},
		startGrowRate: function (island, fromMove) {
			/**
			 * @description Calculate & start grow rate for island
			 *	available only if island has computer or player population 
			 *  and if population is greather then 0
			 * @params island - object containing information for island
			 */
			var time,
				maxPop;
			fromMove = fromMove || false;
			if (island.owner !== 0 && island.val > 0) {
				if (island.growTimer) {
					maxPop = island.rad * 2;
					if (!fromMove && island.val < maxPop) {
						island.val = island.val + 1;
						my.updateIslandVal("", island);
					}
				} else {
					time = my.maxRad / island.initVal * (2000 / my.growSpeed);
					time = parseInt(time, 10);
					//console.log(time + " for island with index " +island.index);
					island.growTimer = setInterval(function() { my.startGrowRate(island); }, time);
				}
			} else {
				if (island.growTimer) {
					clearInterval(island.growTimer);
				}
			}
		},
		testGameEnd: function () {
			var i,
				inslandsNr,
				hasComputer = false,
				hasHuman = false,
				thisOwner,
				gameEnded = true;
			inslandsNr = my.inslandsNr;
			for (i = 0; i < inslandsNr; i = i + 1) {
				thisOwner = my.islands[i].owner;
				if (thisOwner === 1) {
					hasHuman = true;
				} else if (thisOwner === -1) {
					hasComputer = true;
				}
				if (hasHuman && hasComputer) {
					gameEnded = false;
					break;
				}
			}
			if (gameEnded) {
				for (i = 0; i < inslandsNr; i = i + 1) {
					if (my.islands[i].growTimer) {
						clearInterval(my.islands[i].growTimer);
					}
				}
				if (hasHuman) {
					alert("You won!");
				} else {
					alert("You loose!");
				}
			}
		},
		movePopulation: function (startIndex, endIndex) {
			var islandStart = my.islands[startIndex],
				islandEnd = my.islands[endIndex],
				islandEndEl,
				movePop,
				endIslandPop,
				oldOwner,
				newOwner,
				pos;
			//TODO: animation for move, add speed
			movePop = islandStart.val;
			if (movePop >= 2) {
				//only mov if current population is greater or equal to 2
				movePop = parseInt(movePop / 2, 10);
				oldOwner = islandEnd.owner;
				newOwner = islandStart.owner;
				if (oldOwner === newOwner) {
					endIslandPop = islandEnd.val + movePop;
				} else {
					if (oldOwner === -1) {
						pos = my.computerIslands.indexOf(islandEnd.index);
						if (pos >= 0) {
							my.computerIslands.splice(pos, 1);
						}
					}
					endIslandPop = islandEnd.val - movePop;
				}
				if (endIslandPop < 0) {
					//destination island was conquered
					islandEndEl = document.getElementById("island" + islandEnd.index);
					islandEndEl.classList.remove("owner" + oldOwner);
					islandEndEl.classList.add("owner" + newOwner);
					islandEnd.owner = newOwner;
					my.testGameEnd();
				}
				islandStart.val = islandStart.val - movePop;
				my.updateIslandVal("", islandStart);
				islandEnd.val = Math.abs(endIslandPop);
				my.updateIslandVal("", islandEnd);
				my.startGrowRate(islandEnd, true);
			}
		},
		islandSelection: function (e) {
			/**
			 * @description Function executed when island is selected
			 */
			var islandOuterEl,
				island,
				islandIndex;
			islandOuterEl = e.target;
			if (islandOuterEl.classList.contains("island")) {
				islandOuterEl = islandOuterEl.parentNode;
			}
			islandIndex = islandOuterEl.getAttribute("data-index");
			islandIndex = parseInt(islandIndex, 10);
			if (islandIndex >= 0) {
				island = my.islands[islandIndex];
				if (my.startLocationIndex >= 0) {
					document.getElementById("islandOuter" + my.startLocationIndex).classList.remove("selected");
					if (islandIndex !== my.startLocationIndex) {
						//move from my.startLocationIndex to islandIndex
						my.movePopulation(my.startLocationIndex, islandIndex);
					}
					my.startLocationIndex = -1;
				} else {
					if (island.owner > 0) {
						islandOuterEl = document.getElementById("islandOuter" + islandIndex);
						islandOuterEl.classList.add("selected");
						my.startLocationIndex = islandIndex;
					}
				}
			}
		},
		buildIslands: function () {
			var islandOuterEl,
				islandEl,
				battleEl,
				islandRad,
				islandOwner,
				inslandsNr,
				thisIsland;
			battleEl = IB.Area.getBattleAreaElement();
			inslandsNr = my.inslandsNr;
			for (i = 0; i < inslandsNr ; i = i + 1) {
				islandOwner = 0;
				if (i === 0) {
					islandOwner = 1;
				} else if (i === 1) {
					islandOwner = -1;
					my.computerIslands.push(i);
				}
				if (i > 2) {
					my.cR = my.generateRandomDim();
					if (my.cR % 2 === 1) {
						my.cR = my.cR - 1;
					}
				}
				my.calculateIslandCoords(i);
				if (i > 0) {
					my.measureDistance(i);
				}
				islandOuterEl = document.createElement("DIV");
				islandOuterEl.setAttribute("class", "islandOuter");
				islandOuterEl.setAttribute("id", "islandOuter" + i);
				islandOuterEl.setAttribute("data-index", i);
				islandEl = document.createElement("DIV");
				islandEl.setAttribute("class", "island owner" + islandOwner);
				islandEl.setAttribute("id", "island" + i);
				islandOuterEl.appendChild(islandEl);
				battleEl.appendChild(islandOuterEl);
				thisIsland = {
					index: i,
					owner: islandOwner,
					rad: my.cR,
					top: (my.cY[i] - my.cR),
					left: (my.cX[i] - my.cR),
					initVal: (my.cR  / 2),
					val: (my.cR  / 2)
				};
				my.islands[i] = thisIsland;
				my.startGrowRate(thisIsland);
			}
		},
		delegate: function () {
			var islands = document.querySelectorAll("#battleArea .islandOuter"),
				islandsLength = islands.length,
				i;
			for (i = 0; i < islandsLength; i = i + 1) {
				islands[i].addEventListener("click", my.islandSelection, false);
			}
		},
		getLoc: function () {
			return my.islands;
		},
		init: function (w, h) {
			my.w = w;
			my.h = h;
			my.buildIslands();
			my.delegate();
			my.computerReady = true;
		},
		update: function (ratio) {
			var islandOuterEl,
				islandEl,
				islandRad,
				thisIsland,
				radius,
				islandsNr;
			ratio = ratio || 1;
			inslandsNr = my.inslandsNr;
			for (i = 0 ; i < my.inslandsNr; i = i + 1) {
				thisIsland = my.islands[i];
				radius = parseInt(thisIsland.initVal * ratio, 10);
				islandOuterEl = document.getElementById("islandOuter" + i);
				islandOuterEl.style.top = parseInt(thisIsland.top * ratio, 10) + "px";
				islandOuterEl.style.left = parseInt(thisIsland.left * ratio, 10) + "px";
				islandOuterEl.style.width = radius * 2 + "px";
				islandOuterEl.style.height = radius * 2+ "px";
				islandOuterEl.style.borderRadius = radius * 2+ "px";
				islandRad = radius - 1;
				//now island
				islandEl = islandOuterEl.childNodes[0];
				islandEl.style.lineHeight = islandRad * 2 + "px";
				islandEl.style.width = islandRad * 2 + "px";
				islandEl.style.height = islandRad * 2 + "px";
				islandEl.style.borderRadius = islandRad * 2 + "px";
				my.updateIslandVal(islandEl, thisIsland);
			}
		}
	},
	Island = (function () {
		return {
			init: my.init,
			update: my.update,
			getLoc: my.getLoc,
			ready: function () { return my.computerReady; },
			getComputerIslands: function() { return my.computerIslands; }
		};
	}());
	window.IB.Island = Island;
}());