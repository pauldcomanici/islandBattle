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
		growSpeed: 6,
		startLocationIndex: -1,
		computerIslands: [],
		computerReady: false,
		useCachedIslands: true,
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
		destroyIslands: function () {
			var i,
				inslandsMaxIndex;
			inslandsMaxIndex = my.inslandsNr - 1;
			for (i = inslandsMaxIndex; i >= 0; i = i - 1) {
				my.endGrowRate(my.islands[i]);
				my.islands.pop();
			}
			my.islands = [];
		},
		endGrowRate: function (island) {
			if (island.growTimer) {
				clearInterval(island.growTimer);
			}
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
		getCachedIslands: function () {
			var cached,
				cachedMaxIndex,
				randomCacheNr,
				islands;
			cached = [
				'[{"index":0,"owner":1,"rad":48,"top":64,"left":147,"initVal":24,"val":27},{"index":1,"owner":-1,"rad":48,"top":231,"left":16,"initVal":24,"val":27},{"index":2,"owner":0,"rad":48,"top":114,"left":260,"initVal":24,"val":24},{"index":3,"owner":0,"rad":42,"top":232,"left":478,"initVal":21,"val":21},{"index":4,"owner":0,"rad":44,"top":260,"left":178,"initVal":22,"val":22},{"index":5,"owner":0,"rad":40,"top":173,"left":385,"initVal":20,"val":20},{"index":6,"owner":0,"rad":18,"top":283,"left":443,"initVal":9,"val":9},{"index":7,"owner":0,"rad":28,"top":38,"left":328,"initVal":14,"val":14},{"index":8,"owner":0,"rad":48,"top":34,"left":508,"initVal":24,"val":24},{"index":9,"owner":0,"rad":48,"top":36,"left":44,"initVal":24,"val":24}]',
				'[{"index":0,"owner":1,"rad":48,"top":180,"left":460,"initVal":24,"val":31},{"index":1,"owner":-1,"rad":48,"top":55,"left":341,"initVal":24,"val":31},{"index":2,"owner":0,"rad":48,"top":223,"left":290,"initVal":24,"val":24},{"index":3,"owner":0,"rad":18,"top":321,"left":362,"initVal":9,"val":9},{"index":4,"owner":0,"rad":38,"top":76,"left":109,"initVal":19,"val":19},{"index":5,"owner":0,"rad":26,"top":34,"left":266,"initVal":13,"val":13},{"index":6,"owner":0,"rad":18,"top":209,"left":38,"initVal":9,"val":9},{"index":7,"owner":0,"rad":34,"top":282,"left":37,"initVal":17,"val":17},{"index":8,"owner":0,"rad":46,"top":237,"left":174,"initVal":23,"val":23},{"index":9,"owner":0,"rad":16,"top":228,"left":94,"initVal":8,"val":8}]',
				'[{"index":0,"owner":1,"rad":48,"top":218,"left":244,"initVal":24,"val":27},{"index":1,"owner":-1,"rad":48,"top":168,"left":483,"initVal":24,"val":27},{"index":2,"owner":0,"rad":48,"top":209,"left":146,"initVal":24,"val":24},{"index":3,"owner":0,"rad":50,"top":111,"left":282,"initVal":25,"val":25},{"index":4,"owner":0,"rad":26,"top":120,"left":152,"initVal":13,"val":13},{"index":5,"owner":0,"rad":44,"top":6,"left":381,"initVal":22,"val":22},{"index":6,"owner":0,"rad":48,"top":59,"left":21,"initVal":24,"val":24},{"index":7,"owner":0,"rad":36,"top":54,"left":201,"initVal":18,"val":18},{"index":8,"owner":0,"rad":20,"top":306,"left":227,"initVal":10,"val":10},{"index":9,"owner":0,"rad":28,"top":26,"left":530,"initVal":14,"val":14}]',
				'[{"index":0,"owner":1,"rad":48,"top":59,"left":232,"initVal":24,"val":27},{"index":1,"owner":-1,"rad":48,"top":138,"left":59,"initVal":24,"val":27},{"index":2,"owner":0,"rad":48,"top":14,"left":498,"initVal":24,"val":24},{"index":3,"owner":0,"rad":26,"top":157,"left":484,"initVal":13,"val":13},{"index":4,"owner":0,"rad":44,"top":256,"left":200,"initVal":22,"val":22},{"index":5,"owner":0,"rad":42,"top":248,"left":300,"initVal":21,"val":21},{"index":6,"owner":0,"rad":24,"top":203,"left":401,"initVal":12,"val":12},{"index":7,"owner":0,"rad":32,"top":241,"left":103,"initVal":16,"val":16},{"index":8,"owner":0,"rad":30,"top":242,"left":538,"initVal":15,"val":15},{"index":9,"owner":0,"rad":26,"top":9,"left":100,"initVal":13,"val":13}]',
				'[{"index":0,"owner":1,"rad":48,"top":200,"left":355,"initVal":24,"val":26},{"index":1,"owner":-1,"rad":48,"top":13,"left":425,"initVal":24,"val":26},{"index":2,"owner":0,"rad":48,"top":256,"left":115,"initVal":24,"val":24},{"index":3,"owner":0,"rad":30,"top":243,"left":278,"initVal":15,"val":15},{"index":4,"owner":0,"rad":38,"top":105,"left":494,"initVal":19,"val":19},{"index":5,"owner":0,"rad":26,"top":197,"left":560,"initVal":13,"val":13},{"index":6,"owner":0,"rad":34,"top":266,"left":22,"initVal":17,"val":17},{"index":7,"owner":0,"rad":28,"top":199,"left":203,"initVal":14,"val":14},{"index":8,"owner":0,"rad":34,"top":36,"left":36,"initVal":17,"val":17},{"index":9,"owner":0,"rad":40,"top":104,"left":237,"initVal":20,"val":20}]'
			];
			cachedMaxIndex = cached.length - 1;
			randomCacheNr = Math.round(Math.random() * cachedMaxIndex);
			islands = JSON.parse(cached[randomCacheNr]);
			my.inslandsNr = islands.length;
			//console.log(randomCacheNr);
			return islands;
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
				if (!my.useCachedIslands) {
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
				if (my.useCachedIslands) {
					thisIsland = my.islands[i];
				} else {
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
				}
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
			if (my.useCachedIslands) {
				my.islands = my.getCachedIslands();
			}
			my.buildIslands();
			my.delegate();
			my.computerReady = true;
		},
		restart: function (w, h, scaleRatio) {
			var battleEl;
			//reset properties
			my.cX = [];
			my.cY = [];
			my.startLocationIndex = -1;
			my.computerIslands = [];
			my.computerReady = false;
			my.destroyIslands();
			battleEl = IB.Area.getBattleAreaElement();
			battleEl.innerHTML = "";
			//initialize
			my.init(w, h);
			my.update(scaleRatio);
		},
		update: function (ratio) {
			var islandOuterEl,
				islandEl,
				islandRad,
				thisIsland,
				radius,
				islandsNr,
				dimMultiplier,
				innerElMinusDim;
			dimMultiplier = 4;
			innerElMinusDim = 2;
			ratio = ratio || 1;
			inslandsNr = my.inslandsNr;
			for (i = 0 ; i < my.inslandsNr; i = i + 1) {
				thisIsland = my.islands[i];
				radius = parseInt(thisIsland.initVal * ratio, 10);
				islandOuterEl = document.getElementById("islandOuter" + i);
				islandOuterEl.style.top = parseInt(thisIsland.top * ratio, 10) + "px";
				islandOuterEl.style.left = parseInt(thisIsland.left * ratio, 10) + "px";
				islandOuterEl.style.width = radius * dimMultiplier + "px";
				islandOuterEl.style.height = radius * dimMultiplier + "px";
				islandOuterEl.style.borderRadius = radius * dimMultiplier + "px";
				islandRad = radius - 1;
				//now island
				islandEl = islandOuterEl.childNodes[0];
				islandEl.style.lineHeight = (radius * dimMultiplier - innerElMinusDim) + "px";
				islandEl.style.width = (radius * dimMultiplier - innerElMinusDim) + "px";
				islandEl.style.height = (radius * dimMultiplier - innerElMinusDim) + "px";
				islandEl.style.borderRadius = (radius * dimMultiplier - innerElMinusDim) + "px";
				my.updateIslandVal(islandEl, thisIsland);
			}
		}
	},
	Island = (function () {
		return {
			init: my.init,
			update: my.update,
			restart: my.restart,
			getLoc: my.getLoc,
			ready: function () { return my.computerReady; },
			getComputerIslands: function() { return my.computerIslands; }
		};
	}());
	window.IB.Island = Island;
}());