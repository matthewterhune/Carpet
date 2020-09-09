w = 800;
h = 800;
scale = {'x': 1, 'y': 1};
seed = Date.now();
//seed = 1599179365693;

console.log(seed);


function inCircle(p1, p2, p3){ 
  let side=getSides(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
  let a=side.a, b=side.b, c=side.c; 
  let inCenter=getIncenter(a, b, c, p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]); 
  let inRadius=getInradius(a, b, c); 
  return([inCenter.x, inCenter.y, inRadius]);
} 

// Helper Function: Get Sides from Angular points 
function getSides(Ax, Ay, Bx, By, Cx, Cy){ 
  return { 
    a: dist(Bx, By, Cx, Cy), 
    b: dist(Cx, Cy, Ax, Ay), 
    c: dist(Ax, Ay, Bx, By), 
  } 
} 
function getIncenter(a, b, c, x1, y1, x2, y2, x3, y3){ 
  return { 
    x: (a*x1 + b*x2 + c*x3)/(a + b + c), 
    y: (a*y1 + b*y2 + c*y3)/(a + b + c) 
  } 
} 
  
function getInradius(a, b, c){ 
  let s=(a+b+c)/2    // Semi-perimeter 
  let area=sqrt(s*(s-a)*(s-b)*(s-c)) 
  return area/s 
} 





function splitcurve(pts, t) {
    var p0 = [pts[0],pts[1]], p1 = [pts[2],pts[3]], p2 = [pts[4],pts[5]], p3 = [pts[6],pts[7]];

    if (p0[0] == p1[0] && p0[1] == p1[1] && p2[0] == p3[0] && p2[1] == p3[1]) {
    	let p4 = [int(p1[0] + (p2[0]-p1[0])/2.5), int(p1[1] + (p2[1]-p1[1])/2)];
    	let firsthalf = [p0[0], p0[1], p0[0], p0[1], p4[0], p4[1], p4[0], p4[1]];
    	let secondhalf = [p4[0], p4[1], p4[0], p4[1], p3[0], p3[1], p3[0], p3[1]];
    	return [firsthalf, secondhalf];
    } else {
	    let p4 = larp(p0, p1, t);
	    let p5 = larp(p1, p2, t);
	    let p6 = larp(p2, p3, t);
	    let p7 = larp(p4, p5, t);
	    let p8 = larp(p5, p6, t);
	    let p9 = larp(p7, p8, t);

	    let firsthalf = [p0[0], p0[1], p4[0], p4[1], p7[0], p7[1], p9[0], p9[1]];
	    let secondhalf =  [p9[0], p9[1], p8[0], p8[1], p6[0], p6[1], p3[0], p3[1]];
	    return [firsthalf, secondhalf];
	}
}


function getDistance(x1, y1, x2, y2) {
	
	let xs = x2 - x1,
		ys = y2 - y1;		
	
	xs *= xs;
	ys *= ys;
	 
	return Math.sqrt( xs + ys );
};


function packCircles(circles, radius, count, colors){
	for (let i = 0; i < count; i++) {
		for (let j = 0; j < 1000; j++) {
			let x = Math.floor(random() * (w-30*2) / 50) * 50 + 30,
				y = Math.floor(random() * (h - radius*2) + radius);
			let works = true;
			for (let k = 0; k < circles.length; k++) {
				if (getDistance(circles[k][0], circles[k][1], x, y) < circles[k][2] + radius) {
					works = false;
					break;
				}
			}
			if (works == true) {
				if (random()*70 < colors.length) {
					circles.push([x, y, radius, colors[Math.floor(random()*colors.length)]]);
					break;
				} else {
					circles.push([x, y, radius, color('white')]);
					break;
				}
			}
		}

	}
}

function preload() {
  //img = loadImage('woman.png');
}


function setup() {
	setAttributes('antialias', true);
	smooth();
	createCanvas(w, h);
	noLoop();
	randomSeed(seed);
}

function draw() {

	//Color Definitions

	colorMode(HSB);

	colors = [
			 [color('#ffa36c'),
			  color('#ebdc87'),
			  color('#799351')], 

		 	 [color('#f0f0e0'),
		 	  color('#fdcb4a'),
		 	  color('#72777d'),
		 	  color('#41444b'),
		 	  color('#ffa36c'),
			  color('#ebdc87'),
			  color('#799351')]
		 	  ];

	bg = color(45, 10, 80);
	background('white');
	fill(bg);
	noStroke();
	rect(80, 100, w-200, h-200);
	fill('white');
	noStroke();

	//Circle packing to create evenly distributed random points

	circles = [];
	packCircles(circles, 30, 1000, colors[1]);
	packCircles(circles, 15, 1000, colors[1]);
	for (let i = 0; i < 20; i++) {
		circles.push([80, lerp(100, h-100, i/20), 30, color('white')]);
		circles.push([w-120, lerp(100, h-100, i/20), 30, color('white')]);
		circles.push([lerp(80, w-120, i/20), 100, 30, color('white')]);
		circles.push([lerp(80, w-120, i/20), h-100, 30, color('white')]);
	}
	//circles.push([w/2, h/2, 200, color('white')]);

	// Actual Drawing

	for (let i = 0; i < circles.length; i += 1) {
		fill(circles[i][3]);
		//circle(circles[i][0], circles[i][1], circles[i][2]*2);
		var x = circles[i][0];
		var y = circles[i][1];
		var x1, y1 = 0;
		var walk = 8;
		var steps = 40 * circles[i][2];
		var redthread = 0;
		var red = false;
		var mc = colors[0][Math.floor(random()*colors[0].length)];
		if (random()*10 < 9) {
			red = true;
		}
		var rf = random()*500 + 50;
		for (let j = 0; j < steps; j++) {
			x1 = x + random()*walk - walk/2;
			y1 = y + random()*walk - walk/2;
			if (redthread > 0 && red) {
				stroke(mc);
				redthread--;
			} else {
				stroke(circles[i][3]);
				if (random()*rf < 2) {
					redthread = Math.floor(random()*50);
					mc = colors[0][Math.floor(random()*colors[0].length)];
				}
			}
			if (getDistance(x1, y1, circles[i][0], circles[i][1]) < circles[i][2]) {
				line(x, y, x1, y1);
				x = x1;
				y = y1;
			}
		}
	}

	stroke('gray');
	for (let blah = 0; blah < 10; blah++) {
		var search = true,
			x1 = 0,
			y1 = 0,
			x = 0,
			y = 0;

		while(search) {
			let x = Math.floor(random()*w/4),
				y = Math.floor(random()*h);
			if (get(x, y)[0] == 204) {
				x1 = x;
				y1 = y;
				search = false;
			}
		}
		for (let i = 0; i < 1000; i += 1) {
			x = x1 + random()*walk - walk/3;
			y = y1 + random()*walk - walk/2;
			if (get(x, y)[0] == 204) {
				line(x1, y1, x, y);
				x1 = x;
				y1 = y;
			}
		}
	}


}