# Potential ways to improve performance


**In sketches, attach event listeners to canvas instead of window**

- TODO figure out which events (using the p5 interface) work correctly when attached to canvas instead of window
  - Confirmed won't work:
    - `mouseDragged()`
      - [effectively marked as won't fix](https://github.com/processing/p5.js/issues/1967)
    - `touchStart()`
    - `touchEnd()`
    - `touchMoved()`
  - Confirmed will work:
    - ...
  - Yet to confirm:
    - `mouseMoved()`
    - `mousePressed()`
    - `mouseReleased()`
      - but probably want to keep this one global

- Consider bypassing p5 interface and using vanilla JS to assign event listeners. p5 will likely continue to listen globally when updating things like `mouseX`, but at least our logic will not be called each time.
  - E.g. using [code shown here](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event)

```js
p.setup = function () {

  ...

  canvas.elt.addEventListener("mousemove", mouseMoved);

  canvas.elt.addEventListener("mousedown", mousePressed);

  ...

}

let mouseMoved = function () {
  ...
}

let mousePressed = function () {
  ...
}
```
