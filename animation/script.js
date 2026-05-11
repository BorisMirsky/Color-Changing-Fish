window.onload = function(){ 

	var fish = document.getElementById('fishId');
	var fishBody = document.querySelector('.fish-body');
	var finTop = document.querySelector('.fin');
	var finBottom = document.querySelector('.fin-bottom');
	var bgDiv = document.querySelector('.div_background');
	
	// Массив широких полос (каждая 150px, полосы до 1800px)
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
	
	// HEX -> RGB
	function hexToRgb(hex) {
		var r = parseInt(hex.slice(1,3), 16);
		var g = parseInt(hex.slice(3,5), 16);
		var b = parseInt(hex.slice(5,7), 16);
		return { r: r, g: g, b: b };
	}
	
	// RGB -> HEX
	function rgbToHex(r, g, b) {
		return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}
	
	// Получить цвет по X-координате (относительно левого края bgDiv)
	function getColorAtX(relativeX) {
		for (var i = colorStripes.length - 1; i >= 0; i--) {
			if (relativeX >= colorStripes[i].start) {
				return colorStripes[i].color;
			}
		}
		return colorStripes[0].color;
	}
	
	// Усреднённый цвет для массива X-координат
	function getAverageColorAtXPoints(xPoints) {
		var totalR = 0, totalG = 0, totalB = 0;
		var count = 0;
		
		for (var i = 0; i < xPoints.length; i++) {
			var color = getColorAtX(xPoints[i]);
			var rgb = hexToRgb(color);
			totalR += rgb.r;
			totalG += rgb.g;
			totalB += rgb.b;
			count++;
		}
		
		if (count === 0) return '#DCDCDC';
		
		var avgR = Math.round(totalR / count);
		var avgG = Math.round(totalG / count);
		var avgB = Math.round(totalB / count);
		
		return rgbToHex(avgR, avgG, avgB);
	}
	
	// Обновить цвет рыбки по 5 точкам тела
	function updateFishColor() {
		var fishRect = fish.getBoundingClientRect();
		var bgRect = bgDiv.getBoundingClientRect();
		
		var pointsX = [
			fishRect.left,
			fishRect.left + fishRect.width * 0.25,
			fishRect.left + fishRect.width * 0.5,
			fishRect.left + fishRect.width * 0.75,
			fishRect.left + fishRect.width
		];
		
		var relativePoints = [];
		var allInside = true;
		
		for (var i = 0; i < pointsX.length; i++) {
			var x = pointsX[i];
			if (x >= bgRect.left && x <= bgRect.right) {
				relativePoints.push(x - bgRect.left);
			} else {
				allInside = false;
				break;
			}
		}
		
		var currentColor;
		if (allInside && relativePoints.length > 0) {
			currentColor = getAverageColorAtXPoints(relativePoints);
		} else {
			currentColor = '#DCDCDC';
		}
		
		fishBody.style.backgroundColor = currentColor;
		finTop.style.backgroundColor = currentColor;
		finBottom.style.backgroundColor = currentColor;
	}
	
	// ----- Анимация плавания -----
	var direction = 1;   // 1 = вправо, -1 = влево
	var speed = 1.5;     // пикселей за кадр (~90px/сек при 60fps)
	var leftBound, rightBound;
	var animationId = null;
	
	function updateBounds() {
		var bgRect = bgDiv.getBoundingClientRect();
		var fishRect = fish.getBoundingClientRect();
		// Границы: левая = левый край bgDiv, правая = правый край bgDiv - ширина рыбы
		leftBound = bgRect.left;
		rightBound = bgRect.right - fishRect.width;
	}
	
	function swim() {
		var currentLeft = parseFloat(fish.style.left);
		if (isNaN(currentLeft)) {
			// если left не задан (например, при загрузке), берём из getBoundingClientRect
			var rect = fish.getBoundingClientRect();
			currentLeft = rect.left;
		}
		
		var newLeft = currentLeft + direction * speed;
		
		// Проверка границ
		if (newLeft >= rightBound) {
			newLeft = rightBound;
			direction = -1;
			// Зеркальное отражение рыбы при повороте налево
			fish.style.transform = 'scaleX(-1)';
		} else if (newLeft <= leftBound) {
			newLeft = leftBound;
			direction = 1;
			// Возвращаем нормальную ориентацию
			fish.style.transform = 'scaleX(1)';
		}
		
		fish.style.left = newLeft + 'px';
		
		// Обновляем цвет в новой позиции
		updateFishColor();
		
		// Продолжаем анимацию
		animationId = requestAnimationFrame(swim);
	}
	
	// Инициализация: стартовая позиция и границы
	function init() {
		var bgRect = bgDiv.getBoundingClientRect();
		var fishRect = fish.getBoundingClientRect();
		
		// Устанавливаем стартовую позицию внутри фона, если ещё не задана
		var startLeft = 50;
		fish.style.position = 'absolute';
		fish.style.left = startLeft + 'px';
		fish.style.top = (bgRect.top + 200) + 'px';  // вертикально посередине фона
		
		// Обновляем границы
		updateBounds();
		
		// Стартовый цвет
		updateFishColor();
		
		// Запускаем анимацию
		animationId = requestAnimationFrame(swim);
	}
	
	// При изменении размера окна пересчитываем границы
	window.addEventListener('resize', function() {
		updateBounds();
	});
	
	init();
};