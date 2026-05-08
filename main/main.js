window.onload = function(){ 

    // 'ball' 'fishIdS'
	var ball = document.getElementById('fishId');

	ball.onmousedown = function(e) {

	  var coords = getCoords(ball);
	  var shiftX = e.pageX - coords.left;
	  var shiftY = e.pageY - coords.top;
      //
	  console.log(coords);
	  ball.style.position = 'absolute';
	  document.body.appendChild(ball);
	  moveAt(e);

	  ball.style.zIndex = 1000; // над другими элементами

	  function moveAt(e) {
		ball.style.left = e.pageX - shiftX + 'px';
		ball.style.top = e.pageY - shiftY + 'px';
		// current coords 
		//console.log(ball.style.left, ball.style.top);
	  }

	  document.onmousemove = function(e) {
		moveAt(e);
	  };

	  ball.onmouseup = function() {
		document.onmousemove = null;
		ball.onmouseup = null;
	  };

	}

	ball.ondragstart = function() {
	  return false;
	};

	function getCoords(elem) {   // кроме IE8-
	  var box = elem.getBoundingClientRect();
	  //console.log(box.top + pageYOffset);
	  return {
		top: box.top + pageYOffset,
		left: box.left + pageXOffset
	  };
	}
}