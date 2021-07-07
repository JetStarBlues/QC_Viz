let c;

let sketch = function (p) {

  // let c;

  p.setup = function () {
    p.createCanvas(800, 500);

    c = new UnitCircle(p);
    c.setCenter(p.width / 2, p.height / 2);

    c.showNormalizedProof = true;
  }

  p.draw = function () {
    // p.background(220);
    p.background(colors["pal1col0"]);

    c.render();

    p.noLoop();
  }

  // Temporary for testing
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
    //
  }

}  // end sketch

// Note: myp5 == p
let myp5 = new p5(sketch);
