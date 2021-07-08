let c;
let c2;

let showSecondCircle = true;

let sketch = function (p) {

  p.setup = function () {
    p.createCanvas(800, 500);

    c = new UnitCircle(p);
    c.setCenter(p.width / 2, p.height / 2);

    c2 = new UnitCircle(p);
    c2.setCenter(200, 50);
    c2.setSize(50);

    c.showNormalizedProof = true;
  }

  p.draw = function () {
    p.background(colors["pal1col0"]);

    c.render();
    if (showSecondCircle) c2.render();

    p.noLoop();
  }

  // Temporary for testing
  p.mouseMoved = function () {
    c.mouseMovedHandler();
    if (showSecondCircle) c2.mouseMovedHandler();
    p.loop();
  }
  p.mousePressed = function () {
    c.mousePressedHandler();
    if (showSecondCircle) c2.mousePressedHandler();
    p.loop();
  }
  p.mouseReleased = function () {
    c.mouseReleasedHandler();
    if (showSecondCircle) c2.mouseReleasedHandler();
    p.loop();
  }
  p.mouseDragged = function () {
    c.mouseDraggedHandler();
    if (showSecondCircle) c2.mouseDraggedHandler();
    p.loop();
  }
  p.windowResized = function () {
    //
  }

}  // end sketch

// Note: myp5 == p
let myp5 = new p5(sketch);
