let c;

let sketch = function (p) {

  let canvasMinWidth = 640;
  let canvasHeight = 500;
  // let c;
  let cx;
  let cy;

  p.setup = function () {
    // p.createCanvas(800, 500);
    // p.createCanvas(canvasMinWidth, canvasHeight);
    p.createCanvas(p.max(canvasMinWidth, p.windowWidth), canvasHeight);

    c = new UnitCircle(p);

    cx = p.width / 2;
    cy = p.height * 0.4;
    c.setCenter(cx, cy);
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

  drawGrid = function () {
    let gridColor = colors["pal1col2"];

    p.strokeWeight(1);

    // draw axes
    p.stroke(gridColor);
    p.line(cx, 0, cx, p.height);
    p.line(0, cy, p.width, cy);

    // draw ticks on axes
    {
      let circleQ = c.circleRadius / 4;

      p.stroke(gridColor);
      let t = 2;
      for (let x = cx; x < p.width; x += circleQ) {
        p.line(x, cy - t, x, cy + t);
      }
      for (let x = cx; x > 0; x -= circleQ) {
        p.line(x, cy - t, x, cy + t);
      }
      for (let y = cy; y < p.height; y += circleQ) {
        p.line(cx - t, y, cx + t, y);
      }
      for (let y = cy; y > 0; y -= circleQ) {
        p.line(cx - t, y, cx + t, y);
      }
    }

    // label axes
    p.fill(gridColor);
    p.noStroke();
    p.textSize(12);
    p.textFont("monospace");
    p.textAlign(p.LEFT, p.BOTTOM);
    // TODO, this should indicate tick values...
    p.text("∣0⟩", cx + c.circleRadius + 3, cy - 3);
    p.text("∣1⟩", cx + 3, cy - c.circleRadius - 3);
  }


}  // end sketch

// Note: myp5 == p
let myp5 = new p5(sketch);
