# Scroll-Timeline Polyfill
ViewTimeline and ScrollTimeline Polyfill without CSS Parser

# Why?
Scroll Timeline by original [scroll-timeline](https://github.com/flackr/scroll-timeline) at relies on parsing CSS at runtime. Which is bad for performance.
This breaks any other CSS that has syntaxes that may not be covered in repository leading to breaks.

# Usage

1. `npm install -s @web-atoms/scroll-timeline`
2. Set additional `animation-timeline` and `animation-range`, through CSS variables as shown below. This is necessary to avoid parsing and resolving many CSS styles at runtime and which helps in improving performance.
3. And you must write CSS in such a way that `animation-play-state: pause` must be set only for non supported browsers as shown below.

# Example

```css

@keyframes rotate-1 {
    0% {
        rotate: 0deg;
    }
    20% {
        rotate: 60deg;
    }
    40% {
        rotate: 120deg;
    }
    60% {
        rotate: 180deg;
    }
    80% {
        rotate: 240deg;
    }
    100% {
        rotate: 360deg;
    }
}

@keyframes zoom-out {
    0% {
        scale: 1;
    }
    100% {
        scale: 0.2;
    }
}

--default-animation-play-state: unset;
@supports not (animation-timeline: any) {
    --default-animation-play-state: paused;
}

scroll-aware[on-scroll] {
    animation: rotate-1 linear both;

    /** Create following variables to map to animation-name */
    --rotate-1-animation-timeline: scroll();
    --rotate-1-animation-range: 0 20%;

    animation-timeline: var(--rotate-1-animation-timeline);
    animation-range: var(--rotate-1-animation-range);

    animation-duration: 1ms;
    animation-play-state: var(--default-animation-play-state);
}

scroll-aware[on-above] {
    animation: zoom-out linear both;

    /** Create following variables to map to animation-name */
    --zoom-out-animation-timeline: view();
    --zoom-out-animation-range: exit-crossing 0 exit-crossing 100%;

    animation-timeline: var(--zoom-out-animation-timeline);
    animation-range: var(--zoom-out-animation-range);

    animation-duration: 1ms;
    animation-play-state: var(--default-animation-play-state);
}
```

```html

<scroll-aware on-scroll="1">
    <div>A</div>
</scroll-aware>

<scroll-aware on-above="1">
    <div>B</div>
</scroll-aware>
```

You can use classes as well, we have shown the sample as it can work with any combination of CSS.
