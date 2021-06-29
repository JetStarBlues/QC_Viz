// By @acedean
//  https://editor.p5js.org/acedean/sketches/gPKxIWjtA

/* Visual design inspired by
    https://kynd.github.io/p5sketches/index.html
*/

/* Notes:
    - Anything using `elt` is undocumented behaviour
    
    - The p5 coordinate system is such that
      "y increases downwards".
      However, we are attempting to plot the cartesian
      system where "y increases upwards".
      Instead of writing clever code to resolve this,
      opted to work with the p5 system and just
      "flip" the y-values when displaying.
*/

/* Sigh:
    - though I like the ideas here, might have to
      spinoff due to the fact that ux on its own
      is not enough to determine theta and uy.
      Ditto uy.
      
      In spinoff, only the theta slider will be present.
      Alternatively, no dom at all =(
      
    - will get it to final polish first, before
      doing so (so that dom absence only difference)
*/


// ----------------------------------------------

// less fancy but more performant
let performanceMode = false;

// center pos (pixels)
let cx, cy;
// point pos (pixels)
let px, py;
// point pos (unitary)
let ux, uy;
// angle (radians)
let theta;

// point label pos (pixels)
let pLabelX, pLabelY;
let pLabelOffset = 30;

// circle dimensions
let circleW;  // width
let circleR;  // radius
let circleQ;  // radius / 2

//
let canvas;

//
let domControlsContainer;
let uxControlsContainer;
let uyControlsContainer;
let uxSlider;
let uySlider;
let uxInput;
let uyInput;
let uxSliderLabel;
let uySliderLabel;

//
let pIsHovered = false;
let pIsSelected = false;
let pDiameter = 10;
let pDiameterHovered = pDiameter * 1.3;
let pRadius = pDiameter / 2;
let pColor;
let pColorHovered;

//
let pLabelColor;
let pLabelHighlightColor;

//
let projectionXColor;
let projectionYColor;

//
let gridColor;
let gridTickColor;
let gridLabelColor;

//
let bgColor;


// ----------------------------------------------

function setup () {
  // canvas = createCanvas(500, 400);
  canvas = createCanvas(max(500, windowWidth), 400);
  
  // Add event listeners
  canvas.mouseMoved(canvas_mouseMovedHandler);
  canvas.mousePressed(canvas_mousePressedHandler);
  canvas.mouseReleased(canvas_mouseReleasedHandler);
  /* Method doesn't exist
     https://github.com/processing/p5.js/issues/1967
  */
  // canvas.mouseDragged(canvas_mouseDraggedHandler);
  
  //
  cx = width / 2;
  cy = height / 2;
  
  circleW = 180;
  circleR = circleW / 2;
  circleQ = circleR / 2;

  //
  setupDOMControls();
  
  //
  initColors();
  
  //
  textFont("monospace");

  // Set initial state as 0.6∣0⟩ + 0.8∣1⟩
  ux = 0.6;
  uy = -0.8;  // use p5 y-direction internally

  // Propogate initial state
  updateValues();
}

function initColors () {
  // Has to be inside setup in global mode

  /* Palettes...
     - www.colourlovers.com/palette/1811244/1001_Stories
     - www.colourlovers.com/palette/1283145/The_Way_You_Love_Me
  */
  bgColor = color(255,234,173);
  
  pColor = color(0);
  pColorHovered = color(246,114,128);
  
  pLabelColor = color(108,91,123);
  pLabelHighlightColor = color(0);
  
  projectionXColor = color(0);  
  projectionYColor = color(0);

  gridColor = color(0,100);
  gridTickColor = color(0,100);
  gridLabelColor = color(0,100);
}


// ----------------------------------------------

function setupDOMControls () {
  /* Using DOM elements instead of rolling own
     canvas solution.
     
     Using combination of vanillaJS and p5
     to manipulate.
  */
  domControlsContainer = createDiv();

  uxControlsContainer = createDiv();
  uxSliderLabel = createSpan("ux");
  uxSlider = createSlider(-1, 1, 0, 0.01);
  uxInput = createInput("0");

  uyControlsContainer = createDiv();
  uySliderLabel = createSpan("uy");
  uySlider = createSlider(-1, 1, 0, 0.01);
  uyInput = createInput("0");
  
  uxControlsContainer.elt.appendChild(uxSliderLabel.elt);
  uxControlsContainer.elt.appendChild(uxSlider.elt);
  uxControlsContainer.elt.appendChild(uxInput.elt);

  uyControlsContainer.elt.appendChild(uySliderLabel.elt);
  uyControlsContainer.elt.appendChild(uySlider.elt);
  uyControlsContainer.elt.appendChild(uyInput.elt);
  
  domControlsContainer.elt.appendChild(uxControlsContainer.elt);
  domControlsContainer.elt.appendChild(uyControlsContainer.elt);
  
  // domControlsContainer.style("border", "2px solid blue");
  domControlsContainer.style("font-family", "monospace");
  domControlsContainer.style("font-size", "12px");
  domControlsContainer.style("display", "inline-flex");
  domControlsContainer.style("flex-wrap", "wrap");
  domControlsContainer.style("flex-direction", "column");
  
  {
    // uxControlsContainer.style("background", "red");
    uxControlsContainer.style("padding", "3px");
    uxControlsContainer.style("display", "flex");
    uxControlsContainer.style("alignItems", "center");

    uxSliderLabel.style("marginRight", "3px");
    
    uxSlider.style("width", "150px");
    uxSlider.style("marginRight", "5px");

    uxInput.style("width", "60px");
    uxInput.style("font-family", "inherit");
    uxInput.style("font-size", "inherit");
  }

  {
    // uyControlsContainer.style("background", "grey");
    uyControlsContainer.style("padding", "3px");
    uyControlsContainer.style("display", "flex");
    uyControlsContainer.style("alignItems", "center");

    uySliderLabel.style("marginRight", "3px");
    
    uySlider.style("width", "150px");
    uySlider.style("marginRight", "5px");

    uyInput.style("width", "60px");
    uyInput.style("font-family", "inherit");
    uyInput.style("font-size", "inherit");
  }
  
  // Add event listeners
  uxSlider.elt.oninput = uxSlider_onInputHandler;
  uxInput.elt.onchange = uxInput_onChangeHandler;
  uySlider.elt.oninput = uySlider_onInputHandler;
  uyInput.elt.onchange = uyInput_onChangeHandler;
}

function updateDomControls () {
  uxSlider.value(+ux.toFixed(2));
  uySlider.value(-uy.toFixed(2));  // display cartesian y-direction
  uxInput.value(+ux.toFixed(2));
  uyInput.value(-uy.toFixed(2));  // display cartesian y-direction
}


// ----------------------------------------------

function updateValuesUsing_ux (_ux) {
  ux = _ux;
  
  theta = acos(ux);
  
  /* Looks like ux not enough to determine uy...
  
     probably something to do with sq(num) == sq(-num)
  
     Use delta theta to pick direction?
     what about textbox?
  */

  uy = sin(theta);
  // uy = -sin(theta);  // ??
  
  updateValues();  
}

function updateValuesUsing_uy (_uyCartesian) {
  uy = -_uyCartesian;  // use p5 y-direction internally
  
  theta = asin(uy);
  
  // ux = cos(theta);
  ux = -cos(theta);
  
  updateValues();
}

function updateValuesUsing_mousePos () {
  theta = atan2(mouseY - cy, mouseX - cx);
  
  ux = cos(theta);
  uy = sin(theta);
  
  updateValues();
}
  
function updateValues () {
  px = cx + (ux * circleR);
  py = cy + (uy * circleR);

  pLabelX = cx + (ux * (circleR + pLabelOffset));
  pLabelY = cy + (uy * (circleR + pLabelOffset));
  
  // Display changes
  {
    // update DOM controls
    updateDomControls();

    // redraw canvas
    loop();
  }
}


// ----------------------------------------------

function canvas_mouseMovedHandler () {
  // User doesn't have to be exact
  let closeEnough = pRadius * 2.5;

  // sq(a) + sq(b) = sq(c)
  closeEnough = sq(closeEnough);
  let distanceToP = sq(mouseX - px) + sq(mouseY - py);

  if (distanceToP <= closeEnough) {
    pIsHovered = true;    
  }
  else {
    pIsHovered = false;
  }

  // redraw canvas
  loop();
}

function canvas_mousePressedHandler () {
  if (pIsHovered) {
    pIsSelected = true;
    // noCursor();
  }

  // redraw canvas
  loop();
}

function canvas_mouseReleasedHandler () {
  pIsSelected = false;
  // cursor();

  // redraw canvas
  loop();
}

function canvas_mouseDraggedHandler () {
  if (pIsSelected) {
    updateValuesUsing_mousePos();
  }
}


// ----------------------------------------------

function uxSlider_onInputHandler () {
  updateValuesUsing_ux(uxSlider.value());
}

function uxInput_onChangeHandler () {
  updateValuesUsing_ux(parseFloat(uxInput.value()));
}

function uySlider_onInputHandler () {
  updateValuesUsing_uy(uySlider.value());
}

function uyInput_onChangeHandler () {
  updateValuesUsing_uy(parseFloat(uyInput.value()));
}


// ----------------------------------------------

function mouseDragged () {
  canvas_mouseDraggedHandler();
}

function windowResized () {
  resizeCanvas(max(500, windowWidth), 400, true);

  /* Update variables dependent on canvas size,
     that are not set within draw loop.
  */
  cx = width / 2;
  cy = height / 2;
  
  // redo pixel calculations (also redraws)
  updateValues();
}


// ----------------------------------------------

function drawGrid () {
  strokeWeight(1);
  
  // draw axes
  stroke(gridColor);
  line(cx, 0, cx, height);
  line(0, cy, width, cy);
  
  // draw ticks on axes
  {
    stroke(gridTickColor);
    let t = 2;
    for (let x = cx; x < width; x += circleQ) {
      line(x, cy - t, x, cy + t);
    }
    for (let x = cx; x > 0; x -= circleQ) {
      line(x, cy - t, x, cy + t);
    }
    for (let y = cy; y < height; y += circleQ) {
      line(cx - t, y, cx + t, y);
    }
    for (let y = cy; y > 0; y -= circleQ) {
      line(cx - t, y, cx + t, y);
    }
  }
  
  // label axes
  fill(gridLabelColor);
  noStroke();
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text("∣0⟩", cx + circleR + 10, cy - 3);
  text("∣1⟩", cx + 3, cy - circleR - 10);
}

function drawCircle () {
  noFill();
  strokeWeight(1);
  stroke(0);
  ellipse(cx, cy, circleW, circleW);
}

function drawAxesProjections () {
  strokeWeight(1);
  stroke(projectionXColor);
  line(px, py, px, cy);
  stroke(projectionYColor);
  line(px, py, cx, py);
}

function drawPoint () {

  // draw line to point
  strokeWeight(4);
  stroke(0);
  line(cx, cy, px, py);

  // draw point
  let d;
  if (pIsHovered || pIsSelected) {
    fill(pColorHovered);
    d = pDiameterHovered;
  }
  else {
    fill(pColor);
    d = pDiameter;
  }
  noStroke();
  ellipse(px, py, d, d);

  
  // draw point label
  noStroke();
  textSize(14);
  
  // flip orientation for legibility
  if (ux >= 0) {
    textAlign(LEFT, CENTER);
  }
  else {
    textAlign(RIGHT, CENTER);
  }

  /* Trick from here to round floats:
      stackoverflow.com/a/12830454
  */
  let uxText = +ux.toFixed(2);
  let uyText = -uy.toFixed(2);  // display cartesian y-direction

  if (performanceMode) {
    // basic label
    fill(pLabelHighlightColor);
    text(
      `${uxText}∣0⟩ + ${uyText}∣1⟩`,
      pLabelX, pLabelY
    );
  }
  else {
    // label with fancy highlighting

    /* Wonder if using DOM elemenet & CSS would
       be more performant
    */

    let w2 = textWidth(`∣0⟩ + `);
    let w3 = textWidth(`${uyText}`);
    if (ux >= 0) {
      let w1 = textWidth(`${uxText}`);
      fill(pLabelHighlightColor);
      text(`${uxText}`, pLabelX, pLabelY);
      fill(pLabelColor);
      text(`∣0⟩ + `, pLabelX + w1, pLabelY);
      fill(pLabelHighlightColor);
      text(`${uyText}`, pLabelX + w1 + w2, pLabelY);
      fill(pLabelColor);
      text(`∣1⟩`, pLabelX + w1 + w2 + w3, pLabelY);
    }
    else {
      let w4 = textWidth(`∣1⟩`);
      fill(pLabelHighlightColor);
      text(`${uxText}`, pLabelX - w4 - w3 - w2, pLabelY);
      fill(pLabelColor);
      text(`∣0⟩ + `, pLabelX - w4 - w3, pLabelY);
      fill(pLabelHighlightColor);
      text(`${uyText}`, pLabelX - w4, pLabelY);
      fill(pLabelColor);
      text(`∣1⟩`, pLabelX, pLabelY);
    }
  }
}


// ----------------------------------------------

function debug () {

  // draw mouse
  /*
    let w = 10;
    fill(255, 0, 0);
    noStroke();
    ellipse(mouseX, mouseY, w, w);
    strokeWeight(1);
    stroke(255, 0, 0);
    line(cx, cy, mouseX, mouseY);
  */

  // logging
  fill(0);
  noStroke();
  textSize(12);
  textAlign(LEFT, BASELINE);
  text(`theta ${degrees(theta)}`, 10, 10);
  text(`ux ${ux}, uy ${uy}`, 10, 30);
  // text(`px ${px}, py ${py}`, 10, 50);
  // text(`mouseX ${mouseX}, mouseY ${mouseY}`, 10, 70);
}


// ----------------------------------------------

function draw () {  
  // console.log(frameCount);
  
  background(bgColor);

  drawGrid();
  drawCircle();
  drawAxesProjections();
  drawPoint();

  // debug();

  noLoop();
}



/* TODO?

- what should scope of mousemove/press/release be?
  - ex. if mouse released outside canvas, release
    state is never registered and point stays
    highlighted
- add degree arc?
*/
