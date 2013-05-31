if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = window.mozRequestAnimationFrame;
}

if (!window.cancelAnimationFrame) {
	window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
}