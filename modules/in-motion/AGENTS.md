# InMotion

> InMotion (InSpatial Motion) is a powerful, universal animation module that brings everything to life with silky-smooth performance across all platforms and environments.

Things to remember when using InMotion:

- Configure InMotion using data attributes, following a utility-first style similar to Tailwind CSS—no need for complex JavaScript setup.
- InMotion works with any framework and offers native integrations for major frameworks, not just basic compatibility layers.
- Split animations (by word, letter, or item) and number counters are included out of the box, so you don’t need extra plugins.
- Create advanced custom timeline animations using the `line-[{timeline}]` syntax for detailed keyframe control.
- All animations use hardware-accelerated CSS transforms for smooth 60fps performance and automatic cleanup.
- For large elements (over 100vh tall), use `threshold-{value}` to control when animations are triggered.

## Docs

...Referece doc links later

## Minimal API Reference

### Base Animations

- **Fade:** `fade` | `fade-{direction}` | `fade-{distance}` | `fade-{distance}-{distance}` | `fade-{direction}-{distance}` | `fade-{direction}-{distance}-{distance}`
- **Zoom In:** `zoomin` | `zoomin-{direction}` | `zoomin-{intensity}` | `zoomin-{distance}-{intensity}` | `zoomin-{distance}-{distance}-{intensity}` | `zoomin-{direction}-{intensity}` | `zoomin-{direction}-{distance}-{intensity}` | `zoomin-{direction}-{distance}-{distance}-{intensity}`
- **Zoom Out:** `zoomout` | `zoomout-{direction}` | `zoomout-{intensity}` | `zoomout-{distance}-{intensity}` | `zoomout-{distance}-{distance}-{intensity}` | `zoomout-{direction}-{intensity}` | `zoomout-{direction}-{distance}-{intensity}` | `zoomout-{direction}-{distance}-{distance}-{intensity}`
- **Flip:** `flip` | `flip-{direction}` | `flip-{angle}` | `flip-{angle}-{perspective}` | `flip-{direction}-{angle}` | `flip-{direction}-{angle}-{perspective}`

**Directions:** u, d, l, r, ul, ur, dl, dr

### Split Animations

- **Types:** `split-word` | `split-letter` | `split-item`
- **Combined:** `split-{animation}-{direction}` | `split-{animation}-{direction}-{values}`
- **Delays:** `split-delay-{milliseconds}` | `split-delay-{milliseconds}-{stagger}`
- **Stagger types:** linear, center, edges, random

### Counters & Effects

- **Count:** `count-[{target}]` (target: numbers, spaces, dots, commas only)
- **Text Effects:** `text-shimmer` | `text-fluid` (requires split-letter)

### Custom Timeline

- **Syntax:** `line-[{timeline}]`
- **Properties:** `o±{value}` (opacity 0-100) | `s±{value}` (scale) | `sx/sy/sz±{value}` (scale axis) | `t±{value}` (translateX %) | `tx/ty/tz±{value}` (translate axis %) | `r±{value}` (rotateZ °) | `rx/ry/rz±{value}` (rotate axis °) | `b±{value}` (blur rem) | `p±{value}` (perspective rem)
- **Keyframes:** `|` (separator) | `|{percentage}` (% position)

### Modifiers

- **Timing:** `duration-{ms}` | `delay-{ms}`
- **Easing:** `linear` | `ease` | `ease-in` | `ease-out` | `ease-in-out` | `step-start` | `step-end` | `easing-[{css-function}]`
- **Trigger:** `threshold-{percentage}`
- **Effects:** `blur` | `blur-{rem}` | `once` | `loop` | `loop-{type}` | `forwards`
- **Loop types:** mirror, jump

## Framework Usage Examples

```jsx
<View 
     data-inmotion="fade-u duration-500 once"
     on:motionstart={() => console.log('start')}
     on:motionend={() => console.log('end')}
     on:motionprogress={(d) => console.log(d.ratio)}>

     {Content}
     
<View>
```

## API

```javascript
// Configuration
window.InMotion.config({
  defaults: {
    animation: "fade",
    direction: "u",
    duration: 1000,
    delay: 0,
    threshold: 10,
    splitDelay: 30,
    easing: "ease-out",
    blur: false,
    loop: "mirror",
  },
  observersDelay: 50,
  once: false,
});

// Control methods
window.InMotion.initialized(); // Check if running (auto initialized)
window.InMotion.restart(); // Restart InMotion, use only extreme cases, the system is reactive even in shadowRoot
window.InMotion.destroy(); // Shut down, use only extreme cases, the system is reactive even in shadowRoot
window.InMotion.version; // Get version
```
