let topMost;
let bottomMost;
let leftMost;
let rightMost;

// in pixels
let distanceBetweenSlits = 100;
let distanceToScreen = 50;
let wavelength = 20;
let slitWidth = 10;

let dSlider; // slit separation
let lSlider; // dist to screen
let wSlider; // wavelength 

// drawScreen
let n;
let k = 0.5;
let modulo;
let pointColor;

// drawWaves
let wavesToDraw = 20;

let inputRadius = 20;

// drawSineWaves
let pathLength;
let resolution = 500;
let amplitude = 10;
let dx;
let pX, pY, _pX, _pY = [0, 0, 0, 0];
let theta;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255);

	topMost = height / 2;
	bottomMost = -height / 2;
	leftMost = -width / 2;
	rightMost = width / 2;

	dSlider = createSlider(1, height / 2, 100)
	lSlider = createSlider(1, width / 2, width / 4)
	wSlider = createSlider(1, 50, 20)
}
// 60, 330, 26
function draw() {
	background(0);
	translate(width / 2, height / 2)
	applyMatrix(1, 0, 0, -1, 0, 0, 0)

	distanceBetweenSlits = dSlider.value();
	distanceToScreen = lSlider.value();
	wavelength = wSlider.value();

	drawSlits(-0.5 * distanceToScreen)
	drawScreen(0.5 * distanceToScreen)

	stroke(255)
	drawWaves(-0.5 * distanceToScreen)
	drawLines(-0.5 * distanceToScreen)

	drawSineWaves();
}

function drawSlits(x) {
	stroke(255)
	line(x, topMost, x, (0.5 * distanceBetweenSlits) + slitWidth)
	line(x, (0.5 * distanceBetweenSlits), x, -(0.5 * distanceBetweenSlits))
	line(x, -(0.5 * distanceBetweenSlits) - slitWidth, x, bottomMost)
}

function drawScreen(x) {
	for (let y = bottomMost; y < topMost; y++) {
		n = ((distanceBetweenSlits * y) / (distanceToScreen * wavelength));

		// to make sure the modulo is positive
		modulo = (n % k > 0) ? (n % k) : ((n % k) + k)

		// check .draw for details
		if (Math.ceil(n / k) % 2 == 0) {
			pointColor = map(modulo, 0, k, 0, 255)
		} else {
			pointColor = map(modulo, 0, k, 255, 0)
		}
		stroke(pointColor)
		point(x, y)
	}
}

function drawWaves(x) {
	noFill();
	stroke(150)

	for (let i = 1; i <= wavesToDraw; i++) {
		arc(x, 0.5 * (distanceBetweenSlits + slitWidth),
			i * 2*wavelength, i * 2*wavelength, -PI / 2, PI / 2)
	}

	for (let i = 1; i <= wavesToDraw; i++) {
		arc(x, -0.5 * (distanceBetweenSlits + slitWidth),
			i * 2*wavelength, i * 2*wavelength, -PI / 2, PI / 2)
	}

}

function drawLines(x) {
	let mX = mouseX - width / 2;
	let mY = height / 2 - mouseY;

	line(x, 0.5 * (distanceBetweenSlits + slitWidth), 0.5 * distanceToScreen, mY)
	line(x, -0.5 * (distanceBetweenSlits + slitWidth), 0.5 * distanceToScreen, mY)
}


function drawSineWaves() {
	let mX = mouseX - width / 2;
	let mY = height / 2 - mouseY;

	// 1st line
	pathLength = sqrt(
		pow(distanceToScreen, 2) +
		pow(mY - 0.5*(distanceBetweenSlits + slitWidth), 2)
	)
	dx = pathLength / resolution;
	theta = atan((mY-0.5*(distanceBetweenSlits + slitWidth)) / distanceToScreen)
	for (let x = 0; x < pathLength; x += dx) {
		_pX = x;
		_pY = (cos((2*PI/wavelength)*x)*amplitude);

		// rotation matrix
		pX = (_pX*cos(theta)) - (_pY*sin(theta)) - 0.5*distanceToScreen
		pY = (_pX*sin(theta)) + (_pY*cos(theta)) + 0.5*(distanceBetweenSlits + slitWidth)

		point(pX, pY)
	}

	// 2nd line
	pathLength = sqrt(
		pow(distanceToScreen, 2) +
		pow(mY + 0.5*(distanceBetweenSlits + slitWidth), 2)
	)
	dx = pathLength / resolution;
	theta = atan((mY+0.5*(distanceBetweenSlits + slitWidth)) / distanceToScreen)
	for (let x = 0; x < pathLength; x += dx) {
		_pX = x;
		_pY = (cos((2*PI/wavelength)*x)*amplitude);

		// rotation matrix
		pX = (_pX*cos(theta)) - (_pY*sin(theta)) - 0.5*distanceToScreen
		pY = (_pX*sin(theta)) + (_pY*cos(theta)) - 0.5*(distanceBetweenSlits + slitWidth)

		point(pX, pY)
	}
}

function mouseDragged() {
	if (mouseX > width || mouseX < 0 || mouseY < 0 || mouseY > height) return;

	let x = -0.5 * distanceToScreen;

	// changed origin to be center of screen
	let mX = mouseX - width / 2;
	let mY = height / 2 - mouseY;

	if (dist(mX, mY,
		x, 0.5 * (distanceBetweenSlits + slitWidth)) <= inputRadius
		|| dist(mX, mY,
			x, -0.5 * (distanceBetweenSlits + slitWidth)) <= inputRadius) {
		dSlider.value(2 * (dist(x, mY, x, 0)))
	}

	if (dist(mX, mY, x, 0) <= inputRadius) {
		lSlider.value(2 * (dist(mX, 0, 0, 0)))
	}
	return false;
}