(function () {
	var my = {
		battleWidth: 640,
		battleHeight: 360,
		useBattleWidth: 0,
		useBattleHeight: 0,
		isLandscape: true,
		areaId: "playArea",
		battleId: "battleArea",
		restartId: "restart",
		eventsSet: false,
		scaleRatio: 1,
		getAreaElement: function () {
			//@description Get area element
			var areaEl;
			areaEl = document.getElementById(my.areaId);
			return areaEl;
		},
		getBattleAreaElement: function () {
			//@description Get battle area element
			var areaEl;
			areaEl = document.getElementById(my.battleId);
			return areaEl;
		},
		getRestartElement: function () {
			//@description Get restart element
			var el;
			el = document.getElementById(my.restartId);
			return el;
		},
		prepareBattleAreaDim: function (topDim, leftDim, w, h, isLandscape) {
			var battleEl,
				restartEl;
			topDim = topDim / 2;
			topDim = parseInt(topDim, 10);
			leftDim = leftDim / 2;
			leftDim = parseInt(leftDim, 10);
			battleEl = my.getBattleAreaElement();
			battleEl.style["width"] = w + "px";
			battleEl.style["height"] = h + "px";
			battleEl.style.top = topDim + "px";
			battleEl.style.left = leftDim + "px";
			battleEl.style.webkitTransformOrigin = parseInt(h / 2, 10) + "px";
			battleEl.style.mozTransformOrigin = parseInt(h / 2, 10) + "px";
			battleEl.style.oTransformOrigin = parseInt(h / 2, 10) + "px";
			battleEl.style.transformOrigin = parseInt(h / 2, 10) + "px";
			battleEl.classList.remove("portrait");
			restartEl = my.getRestartElement();
			if (isLandscape) {
				restartEl.style["width"] = w + "px";
			} else {
				battleEl.classList.add("portrait");
				restartEl.style["width"] = h + "px";
			}
			restartEl.style.left = leftDim + "px";
		},
		prepareBattleArea: function (w, h) {
			/**
			 * @description Determine battle area dimensions
			 * @param w
			 * @param h
			 */
			var maxDim,
				otherDim,
				baseDim,
				baseDim2,
				topDim,
				battleBiggerDim,
				battleSmallerDim,
				dimensionNameBigger = "width",
				dimensionNameSmaller = "height",
				isLandscape = true,
				battleEl,
				scaleRatio;
			maxDim = w;
			otherDim = h;
			if (maxDim < h) {
				maxDim = h;
				otherDim = w;
				isLandscape = false;
				dimensionNameBigger = "height";
				dimensionNameSmaller = "width";
			}
			baseDim = parseInt(maxDim / 16, 10);
			baseDim2 = parseInt(otherDim / 9, 10);
			if (baseDim > baseDim2) {
				baseDim = baseDim2;
			}
			battleBiggerDim = 16 * baseDim;
			scaleRatio = battleBiggerDim / my.battleWidth;
			battleSmallerDim = 9 * baseDim;
			my.useBattleWidth = battleBiggerDim;
			my.useBattleHeight = battleSmallerDim;
			if (isLandscape) {
				topDim = h - battleSmallerDim;
				leftDim = w - battleBiggerDim;
			} else {
				topDim = h - battleBiggerDim;
				leftDim = w - battleSmallerDim;
			}
			my.prepareBattleAreaDim(topDim, leftDim, battleBiggerDim, battleSmallerDim, isLandscape);
			my.scaleRatio = scaleRatio; //cache value, used for restart
			IB.Island.update(scaleRatio);
		},
		init: function (forUpdate) {
			/**
			 * @description Initialize area
			 */
			var windowScreenWidth,
				windowScreenHeight,
				areaEl,
				mainEl;
			forUpdate = forUpdate || false;
			mainEl = document.querySelector("html");
			windowScreenWidth = mainEl.clientWidth;
			windowScreenHeight = mainEl.clientHeight;
			areaEl = my.getAreaElement();
			areaEl.style.width = windowScreenWidth + "px";
			areaEl.style.height = windowScreenHeight + "px";
			//prepare battle area
			if (!forUpdate) {
				my.prepareBattleAreaDim(0, 0, my.battleWidth, my.battleHeight, true, 1);
			}
			areaEl.style.display = "block";
			if (!my.eventsSet) {
				my.eventsSet = true;
				my.delegate();
				IB.Island.init(my.battleWidth, my.battleHeight);
			} else {
				IB.Island.update(my.useBattleWidth, my.useBattleHeight);
			}
			my.prepareBattleArea(windowScreenWidth, windowScreenHeight - 24);
		},
		update: function () {
			my.init(true);
		},
		/**
		 * Restart game
		 */
		restart: function () {
			IB.Island.restart(my.battleWidth, my.battleHeight, my.scaleRatio);
		},
		delegate: function () {
			/**
			 * @description Attach events
			 */
			var restartEl;
			restartEl = my.getRestartElement();
			restartEl.addEventListener("click", my.restart, false);
			window.addEventListener("resize", my.update, false);
		}
	},
	Area = (function () {
		return {
			init: my.init,
			getBattleAreaElement: my.getBattleAreaElement
		};
	}());
	window.IB.Area = Area;
	
}());