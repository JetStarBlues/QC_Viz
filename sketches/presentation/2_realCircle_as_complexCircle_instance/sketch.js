/*
  Note:
    - Anything using `elt` is undocumented behaviour
*/

let c;

let sketch = function (p) {

  // canvas dimensions
  let canvasMinWidth = 640;
  let canvasHeight = 430;

  // unit circle parameters
  // let c;
  let cx;
  let cy;

  //
  let showGrid;

  // checkboxes
  let showLabelCheckbox;
  let showGridCheckbox;
  let showAxisProjectionsCheckbox;


  // ----------------------------------------------

  p.setup = function () {
    p.createCanvas(p.max(canvasMinWidth, p.windowWidth), canvasHeight);

    // Initialize unit circle
    c = new UnitCircle(p);

    cx = p.width / 2;
    cy = p.height / 2;
    c.setCenter(cx, cy);

    // Set interesting initial value
    c.setFromKet([
      math.complex(0.6, 0),
      math.complex(0.8, 0)
    ]);

    // Initialize view, hide complex
    c.showComplexLabel = false;
    c.showNormalizedCheck = false;
    c.renderAsComplexCircle = false;
    c.showSliders = false;

    // Initialize checkboxes
    initializeCheckboxes();
  }

  p.draw = function () {
    p.background(colors["pal1col0"]);

    if (showGrid) drawGrid();

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

  let initializeCheckboxes = function () {
    //
    c.showLabel = true;

    showLabelCheckbox = p.createCheckbox(
      "show label",
      c.showLabel
    );

    showLabelCheckbox.changed(
      changedHandler_showLabelCheckbox
    );

    //
    showGrid = false;

    showGridCheckbox = p.createCheckbox(
      "show grid",
      showGrid
    );

    showGridCheckbox.changed(
      changedHandler_showGridCheckbox
    );

    //
    c.showAxisProjections = false;

    showAxisProjectionsCheckbox = p.createCheckbox(
      "show axis projections",
      c.showAxisProjections
    );

    showAxisProjectionsCheckbox.changed(
      changedHandler_showAxisProjectionsCheckbox
    );


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    /* Call to en/disable dependent checkboxes
       using inital checkbox state
    */
    changedHandler_showGridCheckbox(true);


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    layoutCheckboxes();
  }

  let layoutCheckboxes = function () {
    // label
    let labelControlsContainer = p.createDiv();
    let labelControlsLabel = p.createDiv("Label");
    labelControlsContainer.elt.appendChild(labelControlsLabel.elt);
    labelControlsContainer.elt.appendChild(showLabelCheckbox.elt);

    // grid
    let gridControlsContainer = p.createDiv();
    let gridControlsLabel = p.createDiv("Grid");
    gridControlsContainer.elt.appendChild(gridControlsLabel.elt);
    gridControlsContainer.elt.appendChild(showGridCheckbox.elt);
    gridControlsContainer.elt.appendChild(showAxisProjectionsCheckbox.elt);

    //
    let checkboxesContainer = p.createDiv();
    checkboxesContainer.elt.appendChild(labelControlsContainer.elt);
    checkboxesContainer.elt.appendChild(gridControlsContainer.elt);


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    checkboxesContainer.style("background", "rgb(198,214,184)");
    checkboxesContainer.style("font-family", "monospace");
    checkboxesContainer.style("font-size", "12px");
    checkboxesContainer.style("display", "flex");
    checkboxesContainer.style("flex-wrap", "wrap");
    checkboxesContainer.style("flex-direction", "row");
    checkboxesContainer.style("justify-content", "center");
    checkboxesContainer.style("padding", "10px 5px");


    const controlsContainerStyle = `
      flex-grow: 1;
      padding: 5px;
    `;
    labelControlsContainer.attribute("style", controlsContainerStyle);
    gridControlsContainer.attribute("style", controlsContainerStyle);


    const controlsLabelStyle = `
      font-weight: bold
    `;
    labelControlsLabel.attribute("style", controlsLabelStyle);
    gridControlsLabel.attribute("style", controlsLabelStyle);
  }


  // ----------------------------------------------

  let changedHandler_showLabelCheckbox = function () {
    if (this.checked()) {
      c.showLabel = true;
    }
    else {
      c.showLabel = false;
    }

    p.loop();
  }

  let changedHandler_showGridCheckbox = function (noLoop) {
    if (showGridCheckbox.checked()) {
      showGrid = true;

      // Enable dependent checkboxes
      showAxisProjectionsCheckbox.elt.children[0].disabled = false;
    }
    else {
      showGrid = false;

      // Disable dependent checkboxes
      showAxisProjectionsCheckbox.elt.children[0].disabled = true;
    }

    if (noLoop === true) return;
    p.loop();
  }

  let changedHandler_showAxisProjectionsCheckbox = function () {
    if (this.checked()) {
      c.showAxisProjections = true;
    }
    else {
      c.showAxisProjections = false;
    }

    p.loop();
  }


  // ----------------------------------------------

  let drawGrid = function () {
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
