var IbLoader = function() {
	var bodyEl;
	function addJs(jsName) {
		var jsBase = "js/",
			loadJsEl;
		loadJsEl = document.createElement("script");
		loadJsEl.setAttribute("type", "text/javascript");
		loadJsEl.setAttribute("src", jsBase + jsName + ".js");
		bodyEl.appendChild(loadJsEl);
	}
	bodyEl = document.querySelector("body");
	if (bodyEl) {
		addJs("island");
		addJs("area");
		addJs("battle");
		testLoaded();
	}
};

function testLoaded(testNr) {
	testNr = testNr || 0;
	if (testNr < 50) {
		if (IB.Area && IB.Island) {
			IB.Area.init();
		} else {
			testNr = testNr + 1;
			setTimeout(function () { testLoaded(testNr); }, 20);
		}
	}
}

window.IB = {};

IbLoader();