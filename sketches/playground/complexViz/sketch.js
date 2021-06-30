let cDiameter = 200;
let cRadius = cDiameter / 2;
let cx;
let cy;

let ixSlider;
let iySlider;
let ixLabel;
let iyLabel;

let canvas;

// i = 1 / sqrt(3)

function compareFloatVector(a, b, epsilon=0.00001) {
  if(a.length !== b.length) return false
  for(let i=0; i<a.length; i++) {
    if(Math.abs(a[i] - b[i]) > epsilon) return false
  }
  return true
}

function compareFloat(a, b, epsilon=0.00001) {
  if(Math.abs(a - b) > epsilon) {
    return false
  }
  return true
}

function magnitudeComplex([alpha, beta]) {
  return sqrt(sq(alpha.re) + sq(beta.re) + sq(alpha.im) + sq(beta.im))
}

function setup() {
  canvas = createCanvas(400, 400);
  canvas.mouseMoved(canvas_mouseMovedHandler);

  cx = width / 2;
  cy = height / 2;

  ixLabel = createSpan("ix:");
  ixSlider = createSlider(-1, 1, 0, 0.01);
  iyLabel = createSpan("iy:");
  iySlider = createSlider(-1, 1, 0, 0.01);

  ixSlider.elt.oninput = ixSlider_onInputHandler;
  iySlider.elt.oninput = iySlider_onInputHandler;
}

ixSlider_onInputHandler = function () {
  // ixLabel.elt.textContent =`ix (${ixSlider.value().toFixed(2)}):`;
  loop();
}

iySlider_onInputHandler = function () {
  // iyLabel.elt.textContent =`iy (${iySlider.value().toFixed(2)}):`;
  loop();
}

canvas_mouseMovedHandler = function () {
  loop();
}

function draw() {
  background(220);

  translate(cx, cy);

  // Theta //////////////////////////
  let theta = atan2(mouseY - cx, mouseX - cy);

  // Slider values //////////////////
  let [ix, iy] = [ixSlider.value(), iySlider.value()]

  // Assemble complex vector
  const imaginaryMagnitude = sqrt(sq(ix)+sq(iy))
  const realMagnitude2 = 1-imaginaryMagnitude // I think this is true, given some consideration
  // some things that are true
  // if iM (imaginary magnitude) is 0, rM (real magnitude) is 1
  // if iM is 1, rM is 0
  // because our quantum states must be on the unit circle, total magnitude (of real plus imaginary parts) is always 1
  // iM = sqrt(sq(ix)+sq(iy))
  // rM = sqrt(sq(rx)+sq(ry))
  // M = sqrt(sq(rx)+sq(ix)+sq(ry)+sq(iy))
  // M = 1
  // we have iM because we ahve ix and iy
  // so we need rM
  // we could get what we need (rM) by solving for the sqares of rx and ry:
  // sqrt(A+B) = 1 where A=sq(rx)+sq(ry) and B=sq(ix)+sq(iy) which we know
  // sqrt(4) = 2
  // sqrt(4+4) = sqrt(8) != 4
  // because 4*4 = 16
  // sqrt(4) + sqrt(4) = 2+2 = 4
  // sqrt(8)=2.84

  // JK, hmmm....
  // const realMagnitude = sqrt(1-sq(imaginaryMagnitude));
  const realMagnitude = sqrt(1-(sq(ix) + sq(iy)));

  // Real circle ////////////////////
  stroke(0);
  fill(255);
  circle(0, 0, cDiameter);

  //
  let ux = cos(theta);
  let uy = sin(theta);

  let pointX = ux * cRadius * realMagnitude;
  let pointY = uy * cRadius * realMagnitude;

  // Circle for the real part of the vector /////////
  stroke(150);
  noFill();
  circle(0, 0, (cRadius * realMagnitude) * 2);

  // Circle for the imaginary part of the vector ///
  stroke(0,255,0);
  // noFill();
  circle(0, 0, (cRadius * imaginaryMagnitude) * 2);

  // Point ///////////////////////////
  stroke(0);
  line(0, 0, pointX, pointY);
  fill(255);
  circle(pointX, pointY, 10);


  // Hmmm....
  /* Are these calcaultions correct?
     Also, what is ix vs imgX?
  */
  noStroke();
  fill(0);
  let realX = ux * realMagnitude;  // ??
  let realY = uy * realMagnitude;  // ??
  let imgX = ux * imaginaryMagnitude;  // ??
  let imgY = uy * imaginaryMagnitude;  // ??
  // let eq1 = 1 === (sq(realX) + sq(realY) + sq(imgX) + sq(imgY));
  // let eq1 = compareFloat(1, sq(realX) + sq(realY) + sq(imgX) + sq(imgY));
  let eq1 = compareFloat(1, sqrt(sq(realX) + sq(realY) + sq(imgX) + sq(imgY)));
  // let eq1_2 = compareFloat(1, sq(realX) + sq(realY) + sq(ix) + sq(iy));
  let eq1_2 = compareFloat(1, sqrt(sq(realX) + sq(realY) + sq(ix) + sq(iy)));

  {
    translate(-cx, -cy);
    textSize(10);
    let y = 10 * 1.5;
    text(`realX: ${+realX.toFixed(2)}`, 10, y);
    text(`realY: ${+realY.toFixed(2)}`, 10, 2*y);
    text(`imgX: ${+imgX.toFixed(2)}`, 10, 3*y);
    text(`imgY: ${+imgY.toFixed(2)}`, 10, 4*y);
    if (!eq1) {
      fill(255,0,0);
    }
    text(`${eq1}: 1 == ${+sq(realX).toFixed(2)} + ${+sq(realY).toFixed(2)} + ${+sq(imgX).toFixed(2)} + ${+sq(imgY).toFixed(2)}`, 10, 5*y);
    fill(0);
    text(`ix: ${+ix.toFixed(2)}`, 10, 6*y);
    text(`iy: ${+iy.toFixed(2)}`, 10, 7*y);
    if (!eq1_2) {
      fill(255,0,0);
    }
    text(`${eq1_2}: 1 == ${+sq(realX).toFixed(2)} + ${+sq(realY).toFixed(2)} + ${+sq(ix).toFixed(2)} + ${+sq(iy).toFixed(2)}`, 10, 8*y);
  }

  // .....
  translate(cx, cy);

  // stroke(0, 0, 255);
  // line(pointX, pointY, pointX, 0);
  // line(pointX, pointY, 0, pointY);

  stroke(150);
  // line(pointX, pointY, pointX + realX, 0);
  // line(pointX, pointY, 0, pointY + realY);

  let imgPointX = ux * cRadius * imaginaryMagnitude;
  let imgPointY = uy * cRadius * imaginaryMagnitude;

  stroke(0, 255, 0);
  // strokeWeight(5);
  // line(imgPointX, imgPointY, imgPointX + imgX, 0);
  // line(imgPointX, imgPointY, 0, imgPointY + imgY);

  // strokeWeight(1);
  stroke(255, 0, 170);
  // line(imgPointX, imgPointY, imgPointX + ix, 0);
  // line(imgPointX, imgPointY, 0, imgPointY + iy);


  noLoop();
}