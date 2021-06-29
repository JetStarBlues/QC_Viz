// By @acedean
//  https://editor.p5js.org/acedean/sketches/aD7k7SVRC

/* Visual design inspired by
    https://kynd.github.io/p5sketches/index.html
*/

/* Notes:
    
    - The p5 coordinate system is such that
      "y increases downwards".
      However, we are attempting to plot the cartesian
      system where "y increases upwards".
      Instead of writing clever code to resolve this,
      opted to work with the p5 system and just
      "flip" the y-values when displaying.
*/


// ----------------------------------------------

let sketch = function (p) {

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

  p.setup = function () {
    // canvas = p.createCanvas(500, 400);
    canvas = p.createCanvas(p.max(500, p.windowWidth), 400);

    // Add event listeners
    canvas.mouseMoved(canvas_mouseMovedHandler);
    canvas.mousePressed(canvas_mousePressedHandler);
    canvas.mouseReleased(canvas_mouseReleasedHandler);
    /* Method doesn't exist
       https://github.com/processing/p5.js/issues/1967
    */
    // canvas.mouseDragged(canvas_mouseDraggedHandler);

    //
    cx = p.width / 2;
    cy = p.height / 2;

    circleW = 180;
    circleR = circleW / 2;
    circleQ = circleR / 2;

    //
    initColors();

    //
    p.textFont("monospace");

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
       - www.colourlovers.com/palette/1597233/500_honies
    */
    // bgColor = p.color(255, 234, 173);
    bgColor = p.color(253, 241, 204);

    pColor = p.color(0);
    pColorHovered = p.color(246, 114, 128);

    pLabelColor = p.color(108, 91, 123);
    pLabelHighlightColor = p.color(0);

    projectionXColor = p.color(0);  
    projectionYColor = p.color(0);

    gridColor = p.color(0, 30);
    gridTickColor = p.color(0, 50);
    gridLabelColor = p.color(0, 100);
  }


  // ----------------------------------------------

  function updateValuesUsing_mousePos () {
    theta = p.atan2(p.mouseY - cy, p.mouseX - cx);

    ux = p.cos(theta);
    uy = p.sin(theta);

    updateValues();
  }

  function updateValues () {
    px = cx + (ux * circleR);
    py = cy + (uy * circleR);

    pLabelX = cx + (ux * (circleR + pLabelOffset));
    pLabelY = cy + (uy * (circleR + pLabelOffset));

    // redraw canvas
    p.loop();
  }


  // ----------------------------------------------

  function canvas_mouseMovedHandler () {
    // User doesn't have to be exact
    let closeEnough = pRadius * 2.5;

    // sq(a) + sq(b) = sq(c)
    closeEnough = p.sq(closeEnough);
    let distanceToP = p.sq(p.mouseX - px) + p.sq(p.mouseY - py);

    if (distanceToP <= closeEnough) {
      pIsHovered = true;    
    }
    else {
      pIsHovered = false;
    }

    // redraw canvas
    p.loop();
  }

  function canvas_mousePressedHandler () {
    if (pIsHovered) {
      pIsSelected = true;
      // p.noCursor();
    }

    // redraw canvas
    p.loop();
  }

  function canvas_mouseReleasedHandler () {
    pIsSelected = false;
    // p.cursor();

    // redraw canvas
    p.loop();
  }

  function canvas_mouseDraggedHandler () {
    if (pIsSelected) {
      updateValuesUsing_mousePos();
    }
  }


  // ----------------------------------------------

  p.mouseDragged = function () {
    canvas_mouseDraggedHandler();
  }

  p.windowResized = function () {
    p.resizeCanvas(p.max(500, p.windowWidth), 400, true);

    /* Update variables dependent on canvas size,
       that are not set within draw loop.
    */
    cx = p.width / 2;
    cy = p.height / 2;

    // redo pixel calculations (also redraws)
    updateValues();
  }


  // ----------------------------------------------

  function drawGrid () {
    p.strokeWeight(1);

    // draw axes
    p.stroke(gridColor);
    p.line(cx, 0, cx, p.height);
    p.line(0, cy, p.width, cy);

    // draw ticks on axes
    {
      p.stroke(gridTickColor);
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
    p.fill(gridLabelColor);
    p.noStroke();
    p.textSize(12);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("∣0⟩", cx + circleR + 10, cy - 3);
    p.text("∣1⟩", cx + 3, cy - circleR - 10);
  }

  function drawCircle () {
    p.noFill();
    p.strokeWeight(1);
    p.stroke(0);
    p.ellipse(cx, cy, circleW, circleW);
  }

  function drawAxesProjections () {
    p.strokeWeight(1);
    p.stroke(projectionXColor);
    p.line(px, py, px, cy);
    p.stroke(projectionYColor);
    p.line(px, py, cx, py);
  }

  function drawPoint () {
    // draw line to point
    p.strokeWeight(4);
    p.stroke(0);
    p.line(cx, cy, px, py);

    // draw point
    let d;
    if (pIsHovered || pIsSelected) {
      p.fill(pColorHovered);
      d = pDiameterHovered;
    }
    else {
      p.fill(pColor);
      d = pDiameter;
    }
    p.noStroke();
    p.ellipse(px, py, d, d);


    // draw point label
    p.noStroke();
    p.textSize(14);

    // flip orientation for legibility
    if (ux >= 0) {
      p.textAlign(p.LEFT, p.CENTER);
    }
    else {
      p.textAlign(p.RIGHT, p.CENTER);
    }

    /* Trick from here to round floats:
        stackoverflow.com/a/12830454
    */
    let uxText = +ux.toFixed(2);
    let uyText = -uy.toFixed(2);  // display cartesian y-direction

    if (performanceMode) {
      // basic label
      p.fill(pLabelHighlightColor);
      p.text(
        `${uxText}∣0⟩ + ${uyText}∣1⟩`,
        pLabelX, pLabelY
      );
    }
    else {
      // label with fancy highlighting

      /* Wonder if using DOM elemenet & CSS would
         be more performant
      */

      let w2 = p.textWidth(`∣0⟩ + `);
      let w3 = p.textWidth(`${uyText}`);
      if (ux >= 0) {
        let w1 = p.textWidth(`${uxText}`);
        p.fill(pLabelHighlightColor);
        p.text(`${uxText}`, pLabelX, pLabelY);
        p.fill(pLabelColor);
        p.text(`∣0⟩ + `, pLabelX + w1, pLabelY);
        p.fill(pLabelHighlightColor);
        p.text(`${uyText}`, pLabelX + w1 + w2, pLabelY);
        p.fill(pLabelColor);
        p.text(`∣1⟩`, pLabelX + w1 + w2 + w3, pLabelY);
      }
      else {
        let w4 = p.textWidth(`∣1⟩`);
        p.fill(pLabelHighlightColor);
        p.text(`${uxText}`, pLabelX - w4 - w3 - w2, pLabelY);
        p.fill(pLabelColor);
        p.text(`∣0⟩ + `, pLabelX - w4 - w3, pLabelY);
        p.fill(pLabelHighlightColor);
        p.text(`${uyText}`, pLabelX - w4, pLabelY);
        p.fill(pLabelColor);
        p.text(`∣1⟩`, pLabelX, pLabelY);
      }
    }
  }


  // ----------------------------------------------

  function debug () {
    // draw mouse
    /*
      let w = 10;
      p.fill(255, 0, 0);
      p.noStroke();
      p.ellipse(p.mouseX, p.mouseY, w, w);
      p.strokeWeight(1);
      p.stroke(255, 0, 0);
      p.line(cx, cy, p.mouseX, p.mouseY);
    */

    // logging
    p.fill(0);
    p.noStroke();
    p.textSize(12);
    p.textAlign(p.LEFT, p.BASELINE);
    let lineSpacing = 2;
    let y = 12 * lineSpacing;
    p.text(`theta ${p.degrees(theta)}`, 10, y);
    y += 12 * lineSpacing;
    p.text(`ux ${ux}, uy ${-uy}`, 10, y);
    // y += 12 * lineSpacing;
    // p.text(`px ${px}, py ${py}`, 10, y);
    // y += 12 * lineSpacing;
    // p.text(`mouseX ${p.mouseX}, mouseY ${p.mouseY}`, 10, y);
  }


  // ----------------------------------------------

  p.draw = function () {  
    // console.log(p.frameCount);

    p.background(bgColor);

    drawGrid();
    drawCircle();
    drawAxesProjections();
    drawPoint();

    // debug();

    p.noLoop();
  }

} // end sketch

// Note: myp5 == p
let myp5 = new p5(sketch);
