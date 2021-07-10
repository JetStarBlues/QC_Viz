/*
  Notes:
    - Anything using `elt` is undocumented behaviour
*/

let c;

let sketch = function (p) {

  // canvas dimensions
  let canvasMinWidth = 640;
  let canvasHeight = 500;

  // unit circle parameters
  // let c;
  let cx;
  let cy;

  //
  let showGrid;

  // checkboxes
  let showLabelCheckbox;
  let showComplexLabelCheckbox;
  let showNormalizedCheckCheckbox;
  let renderAsComplexCircleCheckbox;
  let showImaginaryCircleCheckbox;
  let showUnitCircleCheckbox;
  let showGridCheckbox;
  let showAxisProjectionsCheckbox;
  let showSlidersCheckbox;
  let autoNormalizeSlidersCheckbox;


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

  initializeCheckboxes = function () {
    //
    c.showLabel = true;

    showLabelCheckbox = p.createCheckbox(
      "show label",
      c.showLabel
    );

    showLabelCheckbox.changed(
      changedHandler_showLabelCheckbox
    );

    // TODO, fancy, only enabled if showLabel
    c.showComplexLabel = true;

    showComplexLabelCheckbox = p.createCheckbox(
      "show complex label",
      c.showComplexLabel
    );

    showComplexLabelCheckbox.changed(
      changedHandler_showComplexLabelCheckbox
    );

    // TODO, fancy, only enabled if showComplexLabel
    c.showNormalizedCheck = true;

    showNormalizedCheckCheckbox = p.createCheckbox(
      "show normalized check",
      c.showNormalizedCheck
    );

    showNormalizedCheckCheckbox.changed(
      changedHandler_showNormalizedCheckCheckbox
    );

    //
    c.renderAsComplexCircle = true;

    renderAsComplexCircleCheckbox = p.createCheckbox(
      "show complex circle",
      c.renderAsComplexCircle
    );

    renderAsComplexCircleCheckbox.changed(
      changedHandler_renderAsComplexCircleCheckbox
    );

    // TODO, fancy, only enabled if renderAsComplexCircle
    c.showImaginaryCircle = true;

    showImaginaryCircleCheckbox = p.createCheckbox(
      "show imaginary circle",
      c.showImaginaryCircle
    );

    showImaginaryCircleCheckbox.changed(
      changedHandler_showImaginaryCircleCheckbox
    );

    // TODO, fancy, only enabled if renderAsComplexCircle
    c.showUnitCircle = true;

    showUnitCircleCheckbox = p.createCheckbox(
      "show unit circle",
      c.showUnitCircle
    );

    showUnitCircleCheckbox.changed(
      changedHandler_showUnitCircleCheckbox
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

    // TODO, fancy, only enabled if renderAsComplexCircle
    c.showAxisProjections = false;

    showAxisProjectionsCheckbox = p.createCheckbox(
      "show axis projections",
      c.showAxisProjections
    );

    showAxisProjectionsCheckbox.changed(
      changedHandler_showAxisProjectionsCheckbox
    );

    //
    c.showSliders = true;

    showSlidersCheckbox = p.createCheckbox(
      "show sliders",
      c.showSliders
    );

    showSlidersCheckbox.changed(
      changedHandler_showSlidersCheckbox
    );

    // TODO, fancy, only enabled if showSliders
    c.autoNormalizeSliders = false;

    autoNormalizeSlidersCheckbox = p.createCheckbox(
      "auto normalize sliders",
      c.autoNormalizeSliders
    );

    autoNormalizeSlidersCheckbox.changed(
      changedHandler_autoNormalizeSlidersCheckbox
    );

    //
    layoutCheckboxes();
  }

  layoutCheckboxes = function () {
    // label
    let labelControlsContainer = p.createDiv();
    let labelControlsLabel = p.createDiv("Label");
    labelControlsContainer.elt.appendChild(labelControlsLabel.elt);
    labelControlsContainer.elt.appendChild(showLabelCheckbox.elt);
    labelControlsContainer.elt.appendChild(showComplexLabelCheckbox.elt);
    labelControlsContainer.elt.appendChild(showNormalizedCheckCheckbox.elt);

    // circles
    let circleControlsContainer = p.createDiv();
    let circleControlsLabel = p.createDiv("Circles");
    circleControlsContainer.elt.appendChild(circleControlsLabel.elt);
    circleControlsContainer.elt.appendChild(renderAsComplexCircleCheckbox.elt);
    circleControlsContainer.elt.appendChild(showImaginaryCircleCheckbox.elt);
    circleControlsContainer.elt.appendChild(showUnitCircleCheckbox.elt);

    // grid
    let gridControlsContainer = p.createDiv();
    let gridControlsLabel = p.createDiv("Grid");
    gridControlsContainer.elt.appendChild(gridControlsLabel.elt);
    gridControlsContainer.elt.appendChild(showGridCheckbox.elt);
    gridControlsContainer.elt.appendChild(showAxisProjectionsCheckbox.elt);

    // sliders
    let sliderControlsContainer = p.createDiv();
    let sliderControlsLabel = p.createDiv("Sliders");
    sliderControlsContainer.elt.appendChild(sliderControlsLabel.elt);
    sliderControlsContainer.elt.appendChild(showSlidersCheckbox.elt);
    sliderControlsContainer.elt.appendChild(autoNormalizeSlidersCheckbox.elt);

    //
    let checkboxesContainer = p.createDiv();
    checkboxesContainer.elt.appendChild(labelControlsContainer.elt);
    checkboxesContainer.elt.appendChild(circleControlsContainer.elt);
    checkboxesContainer.elt.appendChild(gridControlsContainer.elt);
    checkboxesContainer.elt.appendChild(sliderControlsContainer.elt);


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // checkboxesContainer.style("border", "2px solid blue");
    checkboxesContainer.style("background", "rgb(198,214,184)");
    checkboxesContainer.style("font-family", "monospace");
    checkboxesContainer.style("font-size", "12px");
    checkboxesContainer.style("display", "flex");
    checkboxesContainer.style("flex-wrap", "wrap");
    checkboxesContainer.style("flex-direction", "row");
    checkboxesContainer.style("justify-content", "center");
    checkboxesContainer.style("padding", "10px 5px");


    // labelControlsContainer.style("border", "1px solid green");
    // circleControlsContainer.style("border", "1px solid green");
    // gridControlsContainer.style("border", "1px solid green");
    // sliderControlsContainer.style("border", "1px solid green");

    labelControlsContainer.style("flex-grow", "1");
    circleControlsContainer.style("flex-grow", "1");
    gridControlsContainer.style("flex-grow", "1");
    sliderControlsContainer.style("flex-grow", "1");

    labelControlsContainer.style("padding", "5px");
    circleControlsContainer.style("padding", "5px");
    gridControlsContainer.style("padding", "5px");
    sliderControlsContainer.style("padding", "5px");


    labelControlsLabel.style("font-weight", "bold");
    circleControlsLabel.style("font-weight", "bold");
    gridControlsLabel.style("font-weight", "bold");
    sliderControlsLabel.style("font-weight", "bold");
  }


  // ----------------------------------------------

  changedHandler_showLabelCheckbox = function () {
    if (this.checked()) {
      c.showLabel = true;
    }
    else {
      c.showLabel = false;
    }

    p.loop();
  }

  changedHandler_showComplexLabelCheckbox = function () {
    if (this.checked()) {
      c.showComplexLabel = true;
    }
    else {
      c.showComplexLabel = false;
    }

    p.loop();
  }

  changedHandler_showNormalizedCheckCheckbox = function () {
    if (this.checked()) {
      c.showNormalizedCheck = true;
    }
    else {
      c.showNormalizedCheck = false;
    }

    p.loop();
  }

  changedHandler_renderAsComplexCircleCheckbox = function () {
    if (this.checked()) {
      c.renderAsComplexCircle = true;
    }
    else {
      c.renderAsComplexCircle = false;
    }

    p.loop();
  }

  changedHandler_showImaginaryCircleCheckbox = function () {
    if (this.checked()) {
      c.showImaginaryCircle = true;
    }
    else {
      c.showImaginaryCircle = false;
    }

    p.loop();
  }

  changedHandler_showUnitCircleCheckbox = function () {
    if (this.checked()) {
      c.showUnitCircle = true;
    }
    else {
      c.showUnitCircle = false;
    }

    p.loop();
  }

  changedHandler_showGridCheckbox = function () {
    if (this.checked()) {
      showGrid = true;
    }
    else {
      showGrid = false;
    }

    p.loop();
  }

  changedHandler_showAxisProjectionsCheckbox = function () {
    if (this.checked()) {
      c.showAxisProjections = true;
    }
    else {
      c.showAxisProjections = false;
    }

    p.loop();
  }

  changedHandler_showSlidersCheckbox = function () {
    if (this.checked()) {
      c.showSliders = true;
    }
    else {
      c.showSliders = false;
    }

    p.loop();
  }

  changedHandler_autoNormalizeSlidersCheckbox = function () {
    if (this.checked()) {
      c.enableAutoNormalizeSliders();
    }
    else {
      c.disableAutoNormalizeSliders();
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
