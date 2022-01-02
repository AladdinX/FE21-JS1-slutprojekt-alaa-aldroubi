// P5 sketch

// Changing the weather variable  
let turpinSpeed = 0.01;
let yoff = 0.1;
let dayNight, weatherCode;
let angle = 0;
let rainDrop = [];
let snowDrop = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  scrib = new Scribble();
  scrib.roughness = 2;
  for (let i = 0; i < 200; i++) {
    snowDrop[i] = new SnowDrop();
  }
  for (let i = 0; i < 300; i++) {
    rainDrop[i] = new RainDrop();
  }
  weatherCode = 610;
}

function draw() {
  const color1 = color(1, 1, 50);
  const color2 = color(135, 206, 235);
  if (dayNight == 'd') {
    setGradient(0, 0, windowWidth, windowHeight, color2, color1); //day
    noStroke();
    //  the sun
    fill(200, 200, 10)
    ellipse(200, 76, 65)
    fill(200, 200, 10, 80)
    ellipse(200, 76, 75)
    fill(200, 200, 10, 20)
    ellipse(200, 76, 85)
  }
  else {
    setGradient(0, 0, windowWidth, windowHeight, color1, color2); //night
    noStroke();
    //   the  moon
    fill(255, 100)
    ellipse(200, 76, 65)
    fill(255, 100)
    ellipse(200, 76, 75)
    fill(255, 20)
    ellipse(200, 76, 85)
  }
  switch (weatherCode) {
    case 500:
      rainNumber = 100;
      snowNumber = 0;
      clouds(2)
      break;
    case 501:
      rainNumber = 200;
      snowNumber = 0;
      clouds(3)
      break;
    case 502:
      rainNumber = 350;
      snowNumber = 0;
      clouds(4)
      break;
    case 600:
      rainNumber = 0;
      snowNumber = 50;
      clouds(2)
      break;
    case 601:
      snowNumber = 100;
      rainNumber = 0;
      clouds(2)
      break;
    case 602:
      snowNumber = 150;
      rainNumber = 0;
      clouds(2)
      break;
    case 610:
      snowNumber = 50;
      rainNumber = 100;
      clouds(4)
      break;
    case 800:
      clouds(0)
      snowNumber = 0;
      rainNumber = 0;
      break;
    case 801:
      clouds(2)
      snowNumber = 0;
      rainNumber = 0;
      break;
    case 802:
      clouds(3)
      snowNumber = 0;
      rainNumber = 0;
      break;
    case 804:
      clouds(4)
      snowNumber = 0;
      rainNumber = 0;
      break;
    default:
      snowNumber = 0;
      rainNumber = 0;
  }
  noStroke();

  // rain
  for (let i = 0; i < rainNumber; i++) {
    rainDrop[i].show();
    rainDrop[i].update();
  }
  // Snow
  randomSeed(0);
  for (let i = 0; i < snowNumber; i++) {
    snowDrop[i].show();
    snowDrop[i].update();
  }
  sea();
  windTurpin();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function clouds(amount) {
  this.x = 120;
  this.y = 99;
  this.size = 50;
  noStroke();
  fill(250);
  for (let i = 1; i < amount; i++) {
    ellipse(this.x + 20 * i, this.y + 9, this.size, this.size);
    ellipse(this.x + 45 * i, this.y, this.size + 20, this.size + 20);
    ellipse(this.x + 60 * i, this.y, this.size + 10, this.size + 10);
  }
}

function RainDrop() {
  this.x = random(0, width);
  this.y = random(0, height);
  this.show = function () {
    fill(250, 200);
    ellipse(this.x, this.y, 2, 10);
  }
  this.update = function () {
    this.speed = random(2, 4);
    this.gravity = 1.05;
    this.y = this.y + this.speed + this.gravity;
    if (this.y > height) {
      this.y = random(0, -width);
      this.gravity = 0;
    }
  }
}

function SnowDrop() {
  this.x = random(0, width);
  this.y = random(0, -height);
  let size = random(10)
  this.show = function () {
    noStroke();
    fill(255, 100)
    scrib.scribbleEllipse(this.x, this.y, size, size);
  }
  this.update = function () {
    this.speed = 2;
    this.y = this.y + this.speed;
    if (this.y > height) {
      this.y = random(0, -height);
    }
  }
}

function windTurpin() {
  fill(255, 80);
  ellipse(284, 480, 14, 570);
  translate(284, 222);
  push();
  rotate(angle);
  ellipse(50, 0, 100, 10);
  rotate(radians(120));
  ellipse(50, 0, 100, 10);
  rotate(radians(120));
  ellipse(50, 0, 100, 10);
  pop();
  angle += turpinSpeed;
  if (angle == 360) { angle = 0 };
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i < w; i++) {
    const inter = map(i, y, h, 0, 0.5);
    const c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}

function sea() {
  fill(100, 170, 255, 200)
  beginShape();
  let xoff = 0;
  for (let x = 0; x <= width; x += 10) {
    let y = map(noise(xoff, yoff), 0, 1, 450, 350);
    vertex(x, y);
    xoff += 0.05;
  }
  yoff += 0.01;
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}
