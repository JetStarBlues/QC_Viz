# Something about yield

TODO, don't quite understand
- https://observablehq.com/@observablehq/observables-not-javascript
- https://observablehq.com/@observablehq/invalidation
- https://observablehq.com/@mbostock/animation-loops
- https://observablehq.com/@tmcw/p5

[Helper function](https://observablehq.com/@tmcw/p5)

```js
function* p5Helper(sketch) {
  const element = DOM.element('div');
  
  // p5.js really likes its target element to already be in the DOM, not just
  // floating around detached. So, before we call P5, we yield it, which puts
  // in the DOM.
  yield element;
  
  // This is ‘instance mode’ in p5 jargon: instead of relying on lots of
  // globals, we create a sketch that has its own copy of everything under p5.
  const instance = new P5(sketch, element, true);

  // This is the tricky part: when you run P5(sketch, element), it starts a
  // loop that updates the drawing a bunch of times a second. If we were just
  // to call P5 repeatedly with different arguments, the loops would all keep
  // running, one on top of the other. So what we do is we use this cell
  // as a generator, and then when that generator is interrupted, like
  // when you update the code in the sketch() method, then we call instance.remove()
  // to clean it up.
  try {
    while (true) {
      yield element;
    }
  }
  finally {
    instance.remove();
  }
}
```

**Sketches on observable look like this (using the helper function)**:

```js
p5Helper(function (p) {
  // code that would be inside of `let sketch = function (p) {...}`
};
```



# Setting the width of the canvas

If we want the width of the canvas to be responsive (i.e. grow/shrink in width according to parent width), the standard approach is to use `p.windowWidth`.

It seems in Observable, `p.windowWidth` is equivalent to `parentNode.offsetWidth`, which is different from `parentNode.clientWidth`. `parentNode.clientWidth` is currently the correct width to use in Observable to align the canvas with other elements in the notebook.


The following:
```js
p.setup = function () {

  p.createCanvas(p.max(canvasMinWidth, p.windowWidth), canvasHeight);

  ...
};
```

Becomes this on Observable:
```js
/*
Note:
  - `canvasParent` is a local global so that can be accessed
    outside `setup()`
*/

// canvas parent node
let canvasParent;

p.setup = function () {

  // Trick to to responsively size canvas on Observable
  let canvas = p.createCanvas(0, 0);
  canvasParent = canvas.elt.parentNode;
  p.resizeCanvas(
    p.max(canvasMinWidth, canvasParent.clientWidth), canvasHeight
  );

  ...
};
```

The following:
```js
p.windowResized = function () {

  p.resizeCanvas(p.max(canvasMinWidth, p.windowWidth), canvasHeight, true);

  ...
};
```

Becomes this on Observable:
```js
p.windowResized = function () {

  // Trick to to responsively size canvas on Observable
  p.resizeCanvas(
    p.max(canvasMinWidth, canvasParent.clientWidth), canvasHeight, true
  );

  ...
};
```
