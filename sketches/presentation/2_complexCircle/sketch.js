/*
  Note:
    - Anything using `elt` is undocumented behaviour
*/

let c;

let sketch = function (p) {

  //
  let canvas;

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
    canvas = p.createCanvas(p.max(canvasMinWidth, p.windowWidth), canvasHeight);

    // Initialize unit circle
    c = new UnitCircle(p);

    cx = p.width / 2;
    cy = p.height * 0.4;
    c.setCenter(cx, cy);

    // Set interesting initial value
    c.setFromKet([
      math.complex(0.6, 0),
      math.complex(0, 0.8)
    ]);

    // Initialize checkboxes
    initializeCheckboxes();
  }

  p.draw = function () {
    p.background(colors["pal1col0"]);

    if (showGrid) drawGrid();

    c.render();

    /* It might be bewildering why normalizedCheck sometimes shows 1 ≠ 1
       This happens because of rounding in the displayed values.
       If the full float is shown, it becomes clear the two
       are not equivalent.
       Uncomment below to see the full values in the console.
    */
    /*
    console.log(`real𝛼: ${c.realX}`);
    console.log(`img𝛼: ${c.imgX}`);
    console.log(`real𝛽: ${c.realY}`);
    console.log(`img𝛽: ${c.imgY}`);
    console.log(`real𝛼² + img𝛼² + real𝛽² + img𝛽² = ${
      c.calculateRealMagnitudeSquared() +
      c.calculateImaginaryMagnitudeSquared()
    }`);
    */

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
    c.showComplexLabel = true;

    showComplexLabelCheckbox = p.createCheckbox(
      "show complex label",
      c.showComplexLabel
    );

    showComplexLabelCheckbox.changed(
      changedHandler_showComplexLabelCheckbox
    );

    //
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

    //
    c.showImaginaryCircle = true;

    showImaginaryCircleCheckbox = p.createCheckbox(
      "show imaginary circle",
      c.showImaginaryCircle
    );

    showImaginaryCircleCheckbox.changed(
      changedHandler_showImaginaryCircleCheckbox
    );

    //
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

    //
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

    //
    c.autoNormalizeSliders = false;

    autoNormalizeSlidersCheckbox = p.createCheckbox(
      "auto normalize sliders",
      c.autoNormalizeSliders
    );

    autoNormalizeSlidersCheckbox.changed(
      changedHandler_autoNormalizeSlidersCheckbox
    );


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    /* Call to en/disable dependent checkboxes
       using inital checkbox state
    */
    changedHandler_showLabelCheckbox(true);
    changedHandler_renderAsComplexCircleCheckbox(true);
    changedHandler_showGridCheckbox(true);
    changedHandler_showSlidersCheckbox(true);


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    layoutCheckboxes();
  }

  let layoutCheckboxes = function () {
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

    canvas.style("display", "block");


    checkboxesContainerStyle = `
      background: rgb(198,214,184);
      font-family: monospace;
      font-size: 12px;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: center;
      padding: 10px 5px;
      line-height: 1em;
    `;
    checkboxesContainer.attribute("style", checkboxesContainerStyle);


    const controlsContainerStyle = `
      flex-grow: 1;
      padding: 5px;
    `;
    labelControlsContainer.attribute("style", controlsContainerStyle);
    circleControlsContainer.attribute("style", controlsContainerStyle);
    gridControlsContainer.attribute("style", controlsContainerStyle);
    sliderControlsContainer.attribute("style", controlsContainerStyle);


    const controlsLabelStyle = `
      font-weight: bold;
    `;
    labelControlsLabel.attribute("style", controlsLabelStyle);
    circleControlsLabel.attribute("style", controlsLabelStyle);
    gridControlsLabel.attribute("style", controlsLabelStyle);
    sliderControlsLabel.attribute("style", controlsLabelStyle);


    const checkboxContainerStyle = `
      display: flex;
      align-items: center;
    `;
    showLabelCheckbox.elt.setAttribute("style", checkboxContainerStyle);
    showComplexLabelCheckbox.elt.setAttribute("style", checkboxContainerStyle);
    showNormalizedCheckCheckbox.elt.setAttribute("style", checkboxContainerStyle);
    renderAsComplexCircleCheckbox.elt.setAttribute("style", checkboxContainerStyle);
    showImaginaryCircleCheckbox.elt.setAttribute("style", checkboxContainerStyle);
    showUnitCircleCheckbox.elt.setAttribute("style", checkboxContainerStyle);
    showGridCheckbox.elt.setAttribute("style", checkboxContainerStyle);
    showAxisProjectionsCheckbox.elt.setAttribute("style", checkboxContainerStyle);
    showSlidersCheckbox.elt.setAttribute("style", checkboxContainerStyle);
    autoNormalizeSlidersCheckbox.elt.setAttribute("style", checkboxContainerStyle);


    const checkboxStyle = `
      margin-left: 1px;
    `;
    showLabelCheckbox.elt.getElementsByTagName("input")[0].setAttribute("style", checkboxStyle);
    showComplexLabelCheckbox.elt.getElementsByTagName("input")[0].setAttribute("style", checkboxStyle);
    showNormalizedCheckCheckbox.elt.getElementsByTagName("input")[0].setAttribute("style", checkboxStyle);
    renderAsComplexCircleCheckbox.elt.getElementsByTagName("input")[0].setAttribute("style", checkboxStyle);
    showImaginaryCircleCheckbox.elt.getElementsByTagName("input")[0].setAttribute("style", checkboxStyle);
    showUnitCircleCheckbox.elt.getElementsByTagName("input")[0].setAttribute("style", checkboxStyle);
    showGridCheckbox.elt.getElementsByTagName("input")[0].setAttribute("style", checkboxStyle);
    showAxisProjectionsCheckbox.elt.getElementsByTagName("input")[0].setAttribute("style", checkboxStyle);
    showSlidersCheckbox.elt.getElementsByTagName("input")[0].setAttribute("style", checkboxStyle);
    autoNormalizeSlidersCheckbox.elt.getElementsByTagName("input")[0].setAttribute("style", checkboxStyle);
  }


  // ----------------------------------------------

  let changedHandler_showLabelCheckbox = function (noLoop) {
    if (showLabelCheckbox.checked()) {
      c.showLabel = true;

      // Enable dependent checkboxes
      showComplexLabelCheckbox.elt.children[0].disabled = false;
      showNormalizedCheckCheckbox.elt.children[0].disabled = false;
    }
    else {
      c.showLabel = false;

      // Disable dependent checkboxes
      showComplexLabelCheckbox.elt.children[0].disabled = true;
      showNormalizedCheckCheckbox.elt.children[0].disabled = true;
    }

    if (noLoop === true) return;
    p.loop();
  }

  let changedHandler_showComplexLabelCheckbox = function () {
    if (this.checked()) {
      c.showComplexLabel = true;
    }
    else {
      c.showComplexLabel = false;
    }

    p.loop();
  }

  let changedHandler_showNormalizedCheckCheckbox = function () {
    if (this.checked()) {
      c.showNormalizedCheck = true;
    }
    else {
      c.showNormalizedCheck = false;
    }

    p.loop();
  }

  let changedHandler_renderAsComplexCircleCheckbox = function (noLoop) {
    if (renderAsComplexCircleCheckbox.checked()) {
      c.renderAsComplexCircle = true;

      // Enable dependent checkboxes
      showImaginaryCircleCheckbox.elt.children[0].disabled = false;
      showUnitCircleCheckbox.elt.children[0].disabled = false;
    }
    else {
      c.renderAsComplexCircle = false;

      // Disable dependent checkboxes
      showImaginaryCircleCheckbox.elt.children[0].disabled = true;
      showUnitCircleCheckbox.elt.children[0].disabled = true;
    }

    if (noLoop === true) return;
    p.loop();
  }

  let changedHandler_showImaginaryCircleCheckbox = function () {
    if (this.checked()) {
      c.showImaginaryCircle = true;
    }
    else {
      c.showImaginaryCircle = false;
    }

    p.loop();
  }

  let changedHandler_showUnitCircleCheckbox = function () {
    if (this.checked()) {
      c.showUnitCircle = true;
    }
    else {
      c.showUnitCircle = false;
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

  let changedHandler_showSlidersCheckbox = function (noLoop) {
    if (showSlidersCheckbox.checked()) {
      c.showSliders = true;

      // Enable dependent checkboxes
      autoNormalizeSlidersCheckbox.elt.children[0].disabled = false;
    }
    else {
      c.showSliders = false;

      // Disable dependent checkboxes
      autoNormalizeSlidersCheckbox.elt.children[0].disabled = true;
    }

    if (noLoop === true) return;
    p.loop();
  }

  let changedHandler_autoNormalizeSlidersCheckbox = function () {
    if (this.checked()) {
      c.enableAutoNormalizeSliders();
    }
    else {
      c.disableAutoNormalizeSliders();
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
