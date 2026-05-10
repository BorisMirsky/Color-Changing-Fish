window.onload = function(){ 

	var fish = document.getElementById('fishId');
	var fishBody = document.querySelector('.fish-body');
	var finTop = document.querySelector('.fin');
	var finBottom = document.querySelector('.fin-bottom');
	var bgDiv = document.querySelector('.div_background');
	
	// Массив широких полос
	var colorStripes = [
		{ start: 0, color: '#00B8D4' },
		{ start: 150, color: '#D50000' },
		{ start: 300, color: '#C51162' },
		{ start: 450, color: '#AA00FF' },
		{ start: 600, color: '#6200EA' },
		{ start: 750, color: '#304FFE' },
		{ start: 900, color: '#2962FF' },
		{ start: 1050, color: '#0091EA' },
		{ start: 1200, color: '#00BFA5' },
		{ start: 1350, color: '#00C853' },
		{ start: 1500, color: '#64DD17' },
		{ start: 1650, color: '#AEEA00' }
	];
	
	
	function getColorAtX(relativeX) {
		for (var i = colorStripes.length - 1; i >= 0; i--) {
			if (relativeX >= colorStripes[i].start) {
				return colorStripes[i].color;
			}
		}
		return colorStripes[0].color;
	}
	
	function updateFishColor() {
		var fishRect = fish.getBoundingClientRect();
		var bgRect = bgDiv.getBoundingClientRect();
		
		var fishCenterX = fishRect.left + fishRect.width / 2;
		
		if (fishCenterX >= bgRect.left && fishCenterX <= bgRect.right) {
			var relativeX = fishCenterX - bgRect.left;
			var currentColor = getColorAtX(relativeX);
			
			fishBody.style.backgroundColor = currentColor;
			finTop.style.backgroundColor = currentColor;
			finBottom.style.backgroundColor = currentColor;
		} else {
			fishBody.style.backgroundColor = '#DCDCDC';
			finTop.style.backgroundColor = '#DCDCDC';
			finBottom.style.backgroundColor = '#DCDCDC';
		}
	}

	// Drag & Drop
	fish.onmousedown = function(e) {
		var coords = getCoords(fish);
		var shiftX = e.pageX - coords.left;
		var shiftY = e.pageY - coords.top;

		fish.style.position = 'absolute';
		document.body.appendChild(fish);
		moveAt(e);

		fish.style.zIndex = 1000; 

		function moveAt(e) {
			fish.style.left = e.pageX - shiftX + 'px';
			fish.style.top = e.pageY - shiftY + 'px';
			updateFishColor();
		}

		document.onmousemove = function(e) {
			moveAt(e);
		};

		fish.onmouseup = function() {
			document.onmousemove = null;
			fish.onmouseup = null;
		};
	};

	fish.ondragstart = function() {
		return false;
	};

	function getCoords(elem) {
		var box = elem.getBoundingClientRect();
		return {
			top: box.top + pageYOffset,
			left: box.left + pageXOffset
		};
	}
	
	// Стартовый цвет (серый, так как рыба ниже фона)
	updateFishColor();
};