/*
  Notes

  - In the p5 coordinate system, the y-axis increases downwards
    (i.e. the highest point is at the bottom of the canvas), whereas
    in the cartesian coordinate system, the y-axis increases upwards
    (i.e. the lowest point is at the bottom of the canvas).

    - For unitary calculations, the cartesian y-direction is used
    - For drawing, the p5 y-direction is used
*/

/*
  TODO

  - If have both sliders (real, imaginary)
    - how avoid inability to set precise (eq 1)
      - case for step e.g. if aiming for exactly 0.6 and 0.8
    - do we want button or something that locks
      - e.g. if adjust real, imaginary auto calculated to make 1?
      - TODO, this is kinda clunky atm
        - if change realX, what does someone intuitively expect
          to change to make unitary (realY, imgX, imgY)??
          - currently imgX and imgY change which feels odd
        - If this will be primary mode to use circle, ideal
          to figure this out
        - Also it feels like sliders should reposition based on mode?
          - i.e. realX, imgX, realY, imgY if no auto
          - realX, realY, imgX, imgY if auto...

  - UI/UX to somehow toggle visibility of details...
    - right click?
    - press hold?

  - Event handling
    - who will dispatch to instances?
      - ex. is there a "global" entity that will receive event
        and trickle it down to each instance?
    - who will call draw method of instances?
      - when will they do this?
    - how to propogate state change across circuit
      - with the whole no-direction thing...

    - Events that should trigger redraw
      - mouse move, press, release, drag
        - on circle
        - on slider
        - currently simple cause react to global
          i.e. not trying to determine "where" occurs
    - Events that should trigger recalc (recalc should be followed by redraw)
      - mouse drag when point selected
      - slider drag when slider selected
      - set from ket
*/

class UnitCircle {

  constructor (p) {

    this.p = p;  // p5.js instance

    /* Do we have this property in every drawable...
       Set to true if requires redraw.
       Global dispatcher iterates through all drawables, and
       calles their render method if they need to be redrawn??

       Or KISS, and just redraw everything on
       - all mouse events
       - ...
    */
    this.isDirty = false;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // Configure display
    this.showLabel = true;
    this.showComplexLabel = true;
    this.showNormalizedCheck = true;

    this.renderAsComplexCircle = true;
    this.showImaginaryCircle = true;

    this.showAxisProjections = false;

    this.showSliders = true;
    this.autoNormalizeSliders = false;  // hmm...


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // value (unitary)
    this.realX;
    this.realY;  // TODO, p5 y-axis thing
    this.imgX;
    this.imgY;
    this.realMagnitude;
    this.imgMagnitude;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // circle dimensions (pixels)
    this.baseCircleWidth = 180;
    this.circleWidth = this.baseCircleWidth;
    this.circleRadius = this.circleWidth / 2;
    this.circleHalfRadius = this.circleRadius / 2;

    // center position (pixels)
    this.centerX = 0;  // arbitrary default value
    this.centerY = 0;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // Point on real circle

    // point position (pixels)
    this.pointX;
    this.pointY;
    // point label position (pixels)
    this.pointLabelX;
    this.pointLabelY;
    this.pointLabelOffset = 15;
    //
    this.pointLabelTextSize = 14;

    //
    this.pointIsHovered = false;
    this.pointIsSelected = false;
    this.pointDiameter = 10;
    this.pointHoveredDiameter = this.pointDiameter * 1.3;
    this.pointRadius = this.pointDiameter / 2;

    // line thickness
    this.vectorThickness = 4;
    this.realCircleThickness = 2;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // Point on imaginary cicle

    // point position (pixels)
    this.imgPointX;
    this.imgPointY;

    //
    this.imgPointIsHovered = false;
    this.imgPointIsSelected = false;
    this.imgPointDiameter = this.pointDiameter * 0.8;
    this.imgPointHoveredDiameter = this.imgPointDiameter * 1.3;
    this.imgPointRadius = this.imgPointDiameter / 2;

    // line thickness
    this.imgVectorThickness = 3;
    this.imgCircleThickness = 2;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    this.unitCircleThickness = 5;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // slider dimensions (pixels)
    this.sliderWidth = this.circleWidth;
    this.sliderHeight = 10;
    this.sliderKnobWidth = this.sliderHeight * 2;

    // slider position (pixels)
    this.sliderBaseX = -this.circleRadius;
    this.sliderBaseY = this.circleRadius * 1.5;

    this.sliderSpacing = this.sliderHeight * 2.3;
    this.realXSliderYPos = this.sliderBaseY;
    this.imgXSliderYPos = this.sliderBaseY + (this.sliderSpacing * 1);
    this.realYSliderYPos = this.sliderBaseY + (this.sliderSpacing * 2);
    this.imgYSliderYPos = this.sliderBaseY + (this.sliderSpacing * 3);

    // realX slider
    this.realXSlider = new Slider(
      this.p,
      this.sliderBaseX,
      this.realXSliderYPos,
      this.sliderWidth, this.sliderHeight, this.sliderKnobWidth,
      -1, 1,
      null,
      0.01
    );
    this.realXSlider.setLabel("realX:");
    this.realXSlider.showLabel = true;

    // imgX slider
    this.imgXSlider = new Slider(
      this.p,
      this.sliderBaseX,
      this.imgXSliderYPos,
      this.sliderWidth, this.sliderHeight, this.sliderKnobWidth,
      -1, 1,
      null,
      0.01
    );
    this.imgXSlider.setLabel("imgX:");
    this.imgXSlider.showLabel = true;

    // realY slider
    this.realYSlider = new Slider(
      this.p,
      this.sliderBaseX,
      this.realYSliderYPos,
      this.sliderWidth, this.sliderHeight, this.sliderKnobWidth,
      -1, 1,
      null,
      0.01
    );
    this.realYSlider.setLabel("realY:");
    this.realYSlider.showLabel = true;

    // imgY slider
    this.imgYSlider = new Slider(
      this.p,
      this.sliderBaseX,
      this.imgYSliderYPos,
      this.sliderWidth, this.sliderHeight, this.sliderKnobWidth,
      -1, 1,
      null,
      0.01
    );
    this.imgYSlider.setLabel("imgY:");
    this.imgYSlider.showLabel = true;


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // ...
    this.updateMiscellanea();


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    this.realCircleColor = this.p.color(0);
    this.unitCircleColor = this.p.color(colors["pal1col2"]);
    this.imgCircleColor = this.p.color(colors["pal1col1"]);

    this.vectorColor = this.p.color(0);
    this.imgVectorColor = this.p.color(colors["pal1col1"]);

    this.pointColor = this.p.color(0);
    this.pointHoveredColor = this.p.color(colors["pal0col1"]);
    this.imgPointColor = this.p.color(colors["pal1col1"]);
    this.imgPointHoveredColor = this.p.color(colors["pal0col4"]);

    this.pointLabelBaseColor = this.p.color(0);
    this.pointLabelSecondaryColor = this.p.color(colors["pal0col3"]);

    this.errorColor = this.p.color(colors["pal0col1"]);

    this.realProjectionXColor = this.p.color(0);
    this.realProjectionYColor = this.p.color(0);
    this.imgProjectionXColor = this.p.color(colors["pal1col1"]);
    this.imgProjectionYColor = this.p.color(colors["pal1col1"]);


    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    // arbitrary default value

    // this.realX = 0.6;
    // this.realY = 0.8;
    // this.imgX = 0;
    // this.imgY = 0;
    // this.realMagnitude = 1;
    // this.imgMagnitude = 0;

    this.realX = 0.4;
    this.realY = 0.2;
    this.imgX = 0.5;
    this.imgY = 0.5;
    this.realMagnitude = this.p.sqrt(this.p.sq(this.realX) + this.p.sq(this.realY));
    this.imgMagnitude = this.p.sqrt(this.p.sq(this.imgX) + this.p.sq(this.imgY));

    // this.realX = 0;
    // this.realY = 0;
    // this.imgX = 0.6;
    // this.imgY = 0.8;
    // this.realMagnitude = this.p.sqrt(this.p.sq(this.realX) + this.p.sq(this.realY));
    // this.imgMagnitude = this.p.sqrt(this.p.sq(this.imgX) + this.p.sq(this.imgY));

    this.realXSlider.setValue(this.realX);
    this.realYSlider.setValue(this.realY);
    this.imgXSlider.setValue(this.imgX);
    this.imgYSlider.setValue(this.imgY);
  }


  // ----------------------------------------------

  /* Value as an array of complex numbers...
     [alpha, beta]
  */
  getKet () {
    return [
      math.complex(this.realX, this.imgX),
      math.complex(this.realY, this.imgY)
    ];
  }

  /* Set value from ket...
  */
  setFromKet (ket) {
    this.realX = ket[0].re;
    this.imgX = ket[0].im;
    this.realX = ket[1].re;
    this.imgX = ket[1].im;

    // TODO, call `updateValuesUsingKet` here?
  }


  // ----------------------------------------------

  // TODO, move `this.realMagnitude` assignment to inside function ??
  calculateRealMagnitude () {
    return this.p.sqrt(this.p.sq(this.realX) + this.p.sq(this.realY));
  }

  calculateImaginaryMagnitude () {
    return this.p.sqrt(this.p.sq(this.imgX) + this.p.sq(this.imgY));
  }


  // ----------------------------------------------

  isUnitary () {
    return compareFloat(
      1,
      this.p.sq(this.realX) + this.p.sq(this.imgX) +
      this.p.sq(this.realY) + this.p.sq(this.imgY)
    );
  }


  // ----------------------------------------------

  setCenter (x, y) {
    this.centerX = x;
    this.centerY = y;

    //
    this.updateSliderPositions();

    //
    this.updateMiscellanea();
  }


  // ----------------------------------------------

  setSize (newCircleWidth) {
    // Resize circle
    this.circleWidth = newCircleWidth;
    this.circleRadius = this.circleWidth / 2;
    this.circleHalfRadius = this.circleRadius / 2;


    // Shrink point size for legibility or KISS?
    if (newCircleWidth < (this.baseCircleWidth * 0.4)) {
      this.pointDiameter = 6;
      this.pointHoveredDiameter = this.pointDiameter * 1.3;
      this.pointRadius = this.pointDiameter / 2;

      // this.imgPointDiameter = this.pointDiameter * 0.8;
      this.imgPointDiameter = this.pointDiameter;
      this.imgPointHoveredDiameter = this.imgPointDiameter * 1.3;
      this.imgPointRadius = this.imgPointDiameter / 2;

      this.vectorThickness = 3;

      this.unitCircleThickness = 4;
    }
    /* Undo above, use defaults
       e.g. scenario where shrink, then enlarge
    */
    else {
      this.pointDiameter = 10;
      this.pointHoveredDiameter = this.pointDiameter * 1.3;
      this.pointRadius = this.pointDiameter / 2;

      this.imgPointDiameter = this.pointDiameter * 0.8;
      this.imgPointHoveredDiameter = this.imgPointDiameter * 1.3;
      this.imgPointRadius = this.imgPointDiameter / 2;

      this.vectorThickness = 4;

      this.unitCircleThickness = 5;
    }


    // Resize sliders
    this.sliderWidth = this.circleWidth;
    this.realXSlider.setSize(this.sliderWidth);
    this.realYSlider.setSize(this.sliderWidth);
    this.imgXSlider.setSize(this.sliderWidth);
    this.imgYSlider.setSize(this.sliderWidth);

    // Reposition sliders (position is based on circle size)
    this.sliderBaseX = -this.circleRadius;
    this.sliderBaseY = this.circleRadius * 1.5;

    this.realXSliderYPos = this.sliderBaseY;
    this.imgXSliderYPos = this.sliderBaseY + (this.sliderSpacing * 1);
    this.realYSliderYPos = this.sliderBaseY + (this.sliderSpacing * 2);
    this.imgYSliderYPos = this.sliderBaseY + (this.sliderSpacing * 3);

    this.updateSliderPositions();


    //
    this.updateMiscellanea();
  }


  // ----------------------------------------------

  updateRealSliderValues () {
    this.realXSlider.setValue(this.realX);
    this.realYSlider.setValue(this.realY);
  }

  updateImaginarySliderValues () {
    this.imgXSlider.setValue(this.imgX);
    this.imgYSlider.setValue(this.imgY);
  }

  updateSliderPositions () {
    this.realXSlider.setTopLeft(
      this.sliderBaseX + this.centerX,
      this.realXSliderYPos + this.centerY
    )
    this.imgXSlider.setTopLeft(
      this.sliderBaseX + this.centerX,
      this.imgXSliderYPos + this.centerY
    )
    this.realYSlider.setTopLeft(
      this.sliderBaseX + this.centerX,
      this.realYSliderYPos + this.centerY
    )
    this.imgYSlider.setTopLeft(
      this.sliderBaseX + this.centerX,
      this.imgYSliderYPos + this.centerY
    )
  }


  // ----------------------------------------------

  updateValuesUsingMouse (updateRealValues) {
    /* Assumes `this.imgX` and `this.imgY`
       have *previously* been set with sliders
    */

    let theta = this.p.atan2(
      this.p.mouseY - this.centerY,
      this.p.mouseX - this.centerX
    );

    let ux = this.p.cos(theta);
    let uy = this.p.sin(theta);

    // Convert from p5 y-direction to cartesian
    uy *= -1;

    if (updateRealValues) {
      this.realX = ux * this.realMagnitude;
      this.realY = uy * this.realMagnitude;

      // propogate change to sliders
      this.updateRealSliderValues();
    }
    else {
      this.imgX = ux * this.imgMagnitude;
      this.imgY = uy * this.imgMagnitude;

      // propogate change to sliders
      this.updateImaginarySliderValues();
    }

    //
    this.updateMiscellanea();
  }

  updateValuesUsingSliders () {
    /* Assumes `this.imgX` and `this.imgY`
       have *just* been set with sliders
    */

    // TODO, auto normalize...
    /* TODO, might have to turn off step for this to work?
    */

    /* If user sets real sliders, imaginary values are auto-computed
       to create normalized vector.
       And vice versa if user sets imaginary sliders.
    */
    if (this.autoNormalizeSliders) {

      // user set real, auto set imaginary
      if (this.realXSlider.knobIsSelected || this.realYSlider.knobIsSelected) {
        console.log("user set real, auto set imaginary");
        // get values from slider
        this.realX = this.realXSlider.getValue();
        this.realY = this.realYSlider.getValue();

        // calculate magnitudes
        let realMagnitudeSquared = this.p.sq(this.realX) + this.p.sq(this.realY);
        // console.log(`realMagSq: ${realMagnitudeSquared}`);

        /*
          TODO
          compareFloat?
          or will slider step resolve...
          if rsq == 1 within epsilon set to 1

          i.e. treat `1.0000000000000002` as 1
        */

        /* Cannot take sqrt of negative number.
           Unable to auto normalize.
        */
        if (realMagnitudeSquared > 1) {
          console.log("abort, negative sqrt");
          return;
        }
        this.realMagnitude = this.p.sqrt(realMagnitudeSquared);
        this.imgMagnitude = this.p.sqrt(1 - realMagnitudeSquared);

        // get current angle
        let theta = this.p.atan2(this.imgY, this.imgX);

        // calculate new values
        this.imgX = this.p.cos(theta) * this.imgMagnitude;
        this.imgY = this.p.sin(theta) * this.imgMagnitude;

        // propogate change to sliders
        this.updateImaginarySliderValues();
      }

      // user set imaginary, auto set real
      else {
        console.log("user set imaginary, auto set real");
        // get values from slider
        this.imgX = this.imgXSlider.getValue();
        this.imgY = this.imgYSlider.getValue();

        // calculate magnitudes
        let imgMagnitudeSquared = this.p.sq(this.imgX) + this.p.sq(this.imgY);
        if (imgMagnitudeSquared > 1) {
          console.log("abort, negative sqrt");
          return;
        }
        this.imgMagnitude = this.p.sqrt(imgMagnitudeSquared);
        this.realMagnitude = this.p.sqrt(1 - imgMagnitudeSquared);

        // get current angle
        let theta = this.p.atan2(this.realY, this.realX);

        // calculate new values
        this.realX = this.p.cos(theta) * this.realMagnitude;
        this.realY = this.p.sin(theta) * this.realMagnitude;

        // propogate changes to sliders
        this.updateRealSliderValues();
      }
    }

    else {
      console.log("use all slider values");
      // get values from slider
      this.realX = this.realXSlider.getValue();
      this.realY = this.realYSlider.getValue();
      this.imgX = this.imgXSlider.getValue();
      this.imgY = this.imgYSlider.getValue();

      this.realMagnitude = this.calculateRealMagnitude();
      this.imgMagnitude = this.calculateImaginaryMagnitude();
    }

    //
    this.updateMiscellanea();
  }

  updateValuesUsingKet () {
    /* Assumes `this.realX`, `this.imgX`, `this.realY`, and `this.imgY`
       have been set via a call to`setFromKet`
    */

    this.realMagnitude = this.calculateRealMagnitude();
    this.imgMagnitude = this.calculateImaginaryMagnitude();

    // propogate changes to sliders
    this.updateRealSliderValues();
    this.updateImaginarySliderValues();

    //
    this.updateMiscellanea();
  }

  updateMiscellanea () {
    // Convert from cartesian y-direction to p5
    let realY = -this.realY;
    let imgY = -this.imgY;

    //
    this.pointX = this.realX * this.circleRadius;
    this.pointY = realY * this.circleRadius;

    this.imgPointX = this.imgX * this.circleRadius;
    this.imgPointY = imgY * this.circleRadius;

    let theta = this.p.atan2(realY, this.realX);
    this.pointLabelX = this.pointX + (this.pointLabelOffset * this.p.cos(theta));
    this.pointLabelY = this.pointY + (this.pointLabelOffset * this.p.sin(theta));

    this.pointX += this.centerX;
    this.pointY += this.centerY;
    this.imgPointX += this.centerX;
    this.imgPointY += this.centerY;
    this.pointLabelX += this.centerX;
    this.pointLabelY += this.centerY;
  }


  // ----------------------------------------------

  mouseIsCloseToPoint (pX, pY, pRadius) {
    // User doesn't have to be exact
    let closeEnough = pRadius * 2.5;

    // sq(a) + sq(b) = sq(c)
    closeEnough = this.p.sq(closeEnough);
    let distanceToPoint = (
      this.p.sq(this.p.mouseX - pX) +
      this.p.sq(this.p.mouseY - pY)
    );

    return distanceToPoint <= closeEnough;
  }

  mouseMovedHandler_draggablePoints () {
    // real point
    if (this.mouseIsCloseToPoint(this.pointX, this.pointY, this.pointRadius)) {
      this.pointIsHovered = true;
    }
    else {
      this.pointIsHovered = false;
    }

    // imaginary point
    this.imgPointIsHovered = false;

    if (this.renderAsComplexCircle && this.showImaginaryCircle) {
      if (this.mouseIsCloseToPoint(this.imgPointX, this.imgPointY, this.imgPointRadius)) {
        this.imgPointIsHovered = true;
      }
    }

    // only one can be chosen... default to real
    if (this.pointIsHovered && this.imgPointIsHovered) {
      this.imgPointIsHovered = false;
    }
  }

  mousePressedHandler_draggablePoints () {
    if (this.pointIsHovered) {
      this.pointIsSelected = true;
      // this.p.noCursor();
    }
    else if (this.imgPointIsHovered) {
      this.imgPointIsSelected = true;
      // this.p.noCursor();
    }
  }

  mouseReleasedHandler_draggablePoints () {
    this.pointIsSelected = false;
    this.imgPointIsSelected = false;
    // this.p.cursor();
  }

  mouseDraggedHandler_draggablePoints () {
    if (this.pointIsSelected) {
      this.updateValuesUsingMouse(true);
    }
    else if (this.imgPointIsSelected) {
      this.updateValuesUsingMouse(false);
    }
  }


  // ----------------------------------------------

  mouseMovedHandler_sliders () {
    if (!this.showSliders) return;

    this.realXSlider.mouseMovedHandler();
    this.imgXSlider.mouseMovedHandler();
    this.realYSlider.mouseMovedHandler();
    this.imgYSlider.mouseMovedHandler();
  }

  mousePressedHandler_sliders () {
    if (!this.showSliders) return;

    this.realXSlider.mousePressedHandler();
    this.imgXSlider.mousePressedHandler();
    this.realYSlider.mousePressedHandler();
    this.imgYSlider.mousePressedHandler();
  }

  mouseReleasedHandler_sliders () {
    if (!this.showSliders) return;

    this.realXSlider.mouseReleasedHandler();
    this.imgXSlider.mouseReleasedHandler();
    this.realYSlider.mouseReleasedHandler();
    this.imgYSlider.mouseReleasedHandler();
  }

  mouseDraggedHandler_sliders () {
    if (!this.showSliders) return;

    this.realXSlider.mouseDraggedHandler();
    this.imgXSlider.mouseDraggedHandler();
    this.realYSlider.mouseDraggedHandler();
    this.imgYSlider.mouseDraggedHandler();

    // Hmm...
    if (
      this.realXSlider.knobIsSelected ||
      this.imgXSlider.knobIsSelected ||
      this.realYSlider.knobIsSelected ||
      this.imgYSlider.knobIsSelected
    ) {
      this.updateValuesUsingSliders();
    }
  }


  // ----------------------------------------------

  mouseMovedHandler () {
    this.mouseMovedHandler_draggablePoints();
    this.mouseMovedHandler_sliders();
  }

  mousePressedHandler () {
    this.mousePressedHandler_draggablePoints();
    this.mousePressedHandler_sliders();
  }

  mouseReleasedHandler () {
    this.mouseReleasedHandler_draggablePoints();
    this.mouseReleasedHandler_sliders();
  }

  mouseDraggedHandler () {
    this.mouseDraggedHandler_draggablePoints();
    this.mouseDraggedHandler_sliders();
  }


  // ----------------------------------------------

  // unit circle (real = 1 and img = 0, or vice versa)
  drawUnitCircle () {
    if (this.renderAsComplexCircle) {
      if (this.isUnitary()) {
        this.p.stroke(this.unitCircleColor);
        this.p.strokeWeight(1);
      }
      else {
        this.p.stroke(this.errorColor);
        // aim of thick stroke is to always be visible regardless of overlap
        this.p.strokeWeight(this.unitCircleThickness);
      }
      // this.p.strokeWeight(1);
      this.p.noFill();
      this.p.circle(this.centerX, this.centerY, this.circleWidth);
    }
  }

  drawRealCircle () {
    this.p.stroke(this.realCircleColor);
    this.p.strokeWeight(this.realCircleThickness);
    this.p.noFill();
    this.p.circle(this.centerX, this.centerY, this.circleWidth * this.realMagnitude);
  }

  drawImaginaryCircle () {
    if (this.renderAsComplexCircle && this.showImaginaryCircle) {
      this.p.stroke(this.imgCircleColor);
      this.p.strokeWeight(this.imgCircleThickness);
      this.p.noFill();
      this.p.circle(this.centerX, this.centerY, this.circleWidth * this.imgMagnitude);
    }
  }

  drawRealPoint () {
    // draw line to point
    this.p.strokeWeight(this.vectorThickness);
    this.p.stroke(this.vectorColor);
    this.p.line(this.centerX, this.centerY, this.pointX, this.pointY);

    // draw point
    let d;
    if (this.pointIsHovered || this.pointIsSelected) {
      this.p.fill(this.pointHoveredColor);
      d = this.pointHoveredDiameter;
    }
    else {
      this.p.fill(this.pointColor);
      d = this.pointDiameter;
    }
    this.p.noStroke();
    this.p.circle(this.pointX, this.pointY, d);
  }

  drawImaginaryPoint () {
    if (this.renderAsComplexCircle && this.showImaginaryCircle)
    {
      // draw line to point
      this.p.strokeWeight(this.imgVectorThickness);
      this.p.stroke(this.imgVectorColor);
      this.p.line(this.centerX, this.centerY, this.imgPointX, this.imgPointY);

      // draw point
      let d;
      if (this.imgPointIsHovered || this.imgPointIsSelected) {
        this.p.fill(this.imgPointHoveredColor);
        d = this.imgPointHoveredDiameter;
      }
      else {
        this.p.fill(this.imgPointColor);
        d = this.imgPointDiameter;
      }
      this.p.noStroke();
      this.p.circle(this.imgPointX, this.imgPointY, d);
    }
  }

  drawPointLabel () {
    if (!this.showLabel) return;

    this.p.noStroke();
    this.p.textFont("monospace");
    this.p.textSize(this.pointLabelTextSize);

    // flip orientation for legibility
    if (this.realX >= 0) {
      this.p.textAlign(this.p.LEFT, this.p.CENTER);
    }
    else {
      this.p.textAlign(this.p.RIGHT, this.p.CENTER);
    }

    //
    let realXText = roundAtMost(this.realX, 2);
    let imgXText = roundAtMost(this.imgX, 2);
    let realYText = roundAtMost(this.realY, 2);
    let imgYText = roundAtMost(this.imgY, 2);

    // Draw label
    this.p.fill(this.pointLabelBaseColor);
    if (this.showComplexLabel) {
      this.p.text(
        `(${realXText} + ${imgXText}i)∣0⟩ + (${realYText} + ${imgYText}i)∣1⟩`,
        // `【${realXText} + ${imgXText}i】∣0⟩ + 【${realYText} + ${imgYText}i】∣1⟩`,
        this.pointLabelX, this.pointLabelY
      );
    }
    else {
      this.p.text(
        `${realXText}∣0⟩ + ${realYText}∣1⟩`,
        this.pointLabelX, this.pointLabelY
      );
    }

    // Show whether sum of squares equals 1
    if (this.showNormalizedCheck) {

      // equation
      this.p.fill(this.pointLabelSecondaryColor);

      let y = this.pointLabelY + (this.pointLabelTextSize * 2);
      this.p.text(
        ` 1 = (real𝛼² + img𝛼²) + (real𝛽² + img𝛽²)`,
        this.pointLabelX, y
      )

      // substitution
      let symbol;
      if (this.isUnitary()) {
        symbol = "=";
        this.p.fill(this.pointLabelSecondaryColor);
      }
      else {
        symbol = "≠";
        this.p.fill(this.errorColor);
      }

      y += this.pointLabelTextSize * 1.4;
      this.p.text(
        `   ${symbol} ` +
        `(${roundAtMost(this.realX, 2)}² + ${roundAtMost(this.imgX, 2)}²) + ` +
        `(${roundAtMost(this.realY, 2)}² + ${roundAtMost(this.imgY, 2)}²)`,

        this.pointLabelX, y
      )

      y += this.pointLabelTextSize * 1.4;
      this.p.text(
        `   ${symbol} ` +
        `(${roundAtMost(this.p.sq(this.realX), 2)} + ${roundAtMost(this.p.sq(this.imgX), 2)}) + ` +
        `(${roundAtMost(this.p.sq(this.realY), 2)} + ${roundAtMost(this.p.sq(this.imgY), 2)})`,

        this.pointLabelX, y
      )

      // Add one more line if not unitary, less math for user to do in head
      y += this.pointLabelTextSize * 1.4;
      if (symbol === "≠") {
        this.p.text(
          `   ${symbol} ` +
          `${roundAtMost(
            this.p.sq(this.realX) + this.p.sq(this.imgX) + this.p.sq(this.realY) + this.p.sq(this.imgY),
            2
          )}`,
          this.pointLabelX, y
        );
      }
    }
  }

  drawRealAxisProjections () {
    if (!this.showAxisProjections) return;

    this.p.strokeWeight(1);
    this.p.stroke(this.realProjectionXColor);
    this.p.line(this.pointX, this.pointY, this.pointX, this.centerY);
    this.p.stroke(this.realProjectionYColor);
    this.p.line(this.pointX, this.pointY, this.centerX, this.pointY);
  }

  drawImaginaryAxisProjections () {
    if (!this.showAxisProjections) return;

    if (this.renderAsComplexCircle && this.showImaginaryCircle) {
      this.p.strokeWeight(1);
      this.p.stroke(this.imgProjectionXColor);
      this.p.line(this.imgPointX, this.imgPointY, this.imgPointX, this.centerY);
      this.p.stroke(this.imgProjectionYColor);
      this.p.line(this.imgPointX, this.imgPointY, this.centerX, this.imgPointY);
    }
  }

  drawSliders () {
    if (!this.showSliders) return;

    this.realXSlider.render();
    this.imgXSlider.render();
    this.realYSlider.render();
    this.imgYSlider.render();
  }

  render () {
    this.drawUnitCircle();

    this.drawImaginaryCircle();
    this.drawImaginaryAxisProjections();
    this.drawImaginaryPoint();

    this.drawRealCircle();
    this.drawRealAxisProjections();
    this.drawRealPoint();

    this.drawSliders();

    this.drawPointLabel();
  }
}
