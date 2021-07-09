let c;

let sketch = function (p) {

  // canvas dimensions
  let canvasMinWidth = 640;
  let canvasHeight = 500;

  // unit circle parameters
  // let c;
  let cx;
  let cy;

  // checkboxes
  let showNormalizedCheckCheckbox;




  // ----------------------------------------------

  p.setup = function () {
    // p.createCanvas(800, 500);
    // p.createCanvas(canvasMinWidth, canvasHeight);
    p.createCanvas(p.max(canvasMinWidth, p.windowWidth), canvasHeight);

    // Initialize unit circle
    c = new UnitCircle(p);

    cx = p.width / 2;
    cy = p.height * 0.4;
    c.setCenter(cx, cy);


    // Initialize checkboxes
    initializeCheckboxes();
  }

  p.draw = function () {
    p.background(colors["pal1col0"]);

    drawGrid();

    c.render();

    p.noLoop();
  }


  // ----------------------------------------------

  p.mouseMoved = function () {
    c.mouseMovedHandler();
    p.loop();
  }
  p.mousePressed = function () {
    c.mousePressedHandler();
    p.loop();
  }
  p.mouseReleased = function () {
    c.mouseReleasedHandler();
    p.loop();
  }
  p.mouseDragged = function () {
    c.mouseDraggedHandler();
    p.loop();
  }

  p.windowResized = function () {
    p.resizeCanvas(p.max(canvasMinWidth, p.windowWidth), canvasHeight, true);

    /* Update variables dependent on canvas size,
       that are not set within draw loop.
    */
    cx = p.width / 2;
    cy = p.height * 0.4;
    c.setCenter(cx, cy);

    //
    p.loop();
  }


  // ----------------------------------------------

  initializeCheckboxes = function () {
    /* TODO
       - add container div and style with flex
       - figure out basic label styling
    */

    // Lets start with this enabled
    c.showNormalizedCheck = true;

    showNormalizedCheckCheckbox = p.createCheckbox(
      "show normalized check",
      c.showNormalizedCheck
    );

    showNormalizedCheckCheckbox.changed(
      changedHandler_showNormalizedCheckCheckbox
    );


  }

  // ----------------------------------------------

  changedHandler_showNormalizedCheckCheckbox = function () {
    if (this.checked()) {
      c.showNormalizedCheck = true;
      console.log("true");
    }
    else {
      c.showNormalizedCheck = false;
      console.log("false");
    }

    p.loop();
  }



  // ----------------------------------------------

  drawGrid = function () {
    let gridColor = colors["pal1col2"];

    p.strokeWeight(1);

    // draw axes
    p.stroke(gridColor);
    p.line(cx, 0, cx, p.height);
    p.line(0, cy, p.width, cy);


    // draw ticks on axes
    let circleQ = c.circleRadius / 4;

    p.stroke(gridColor);
    let tickRadius = 2;
    for (let x = cx; x < p.width; x += circleQ) {
      p.line(x, cy - tickRadius, x, cy + tickRadius);
    }
    for (let x = cx; x > 0; x -= circleQ) {
      p.line(x, cy - tickRadius, x, cy + tickRadius);
    }
    for (let y = cy; y < p.height; y += circleQ) {
      p.line(cx - tickRadius, y, cx + tickRadius, y);
    }
    for (let y = cy; y > 0; y -= circleQ) {
      p.line(cx - tickRadius, y, cx + tickRadius, y);
    }


    // label axes
    p.fill(gridColor);
    p.noStroke();
    p.textSize(12);
    p.textFont("monospace");

    let labelPadding = 8;

    // position x-axis label towards right of screen
    let labelXOffset = (p.floor(cx / circleQ) - 1) * circleQ;
    // move it a bit so that doesn't look like tick label
    labelXOffset += circleQ / 2;

    p.textAlign(p.CENTER, p.TOP);
    p.text("∣0⟩", cx + labelXOffset, cy + labelPadding);

    // position y-axis label towards top of screen
    let labelYOffset = (p.floor(cy / circleQ) - 1) * circleQ;
    // move it a bit so that doesn't look like tick label
    labelYOffset += circleQ / 2;

    p.textAlign(p.RIGHT, p.CENTER);
    p.text("∣1⟩", cx - labelPadding, cy - labelYOffset);


    /* The following calculations can be moved to setup
       if performance is a concern:
       - circleQ
       - labelXOffset
       - labelYOffset
    */
  }

}  // end sketch

// Note: myp5 == p
let myp5 = new p5(sketch);
