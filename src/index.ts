import "./scroll-timeline/proxy-animation";
import { onDomReady } from "./dom-ready";
import { initPolyfill } from "./scroll-timeline/init";
import { parseTimeline } from "./min-css/parseTimeline";
import { resolveStyleValue } from "./min-css/resolveStyleValue";
import { ScrollTimeline, ViewTimeline } from "./scroll-timeline/scroll-timeline-base";

initPolyfill();

const createTimeline = (e: HTMLElement, a: CSSAnimation) => {

    // we need to create some mapping
    const animationID = a.animationName;

    const style = window.getComputedStyle(e);

    // get variables..
    const { view, scroll } = parseTimeline(style, animationID);

    let timeline;

    const options = {};

    if (view) {
        timeline = new ViewTimeline({ subject: e, ... view });
    }

    if (scroll) {
        timeline = new ScrollTimeline({ ... scroll });
    }

    let range = resolveStyleValue(style, `--${animationID}-animation-range`)?.trim() || void 0;
    if (!range) {
        let rangeStart = resolveStyleValue(style, `--${animationID}-animation-range-start`)
        let rangeEnd = resolveStyleValue(style, `--${animationID}-animation-range-end`)
        if (rangeStart) {
            rangeEnd ||= "normal"
            range = `${rangeStart} ${rangeEnd}`;
        } else {
            if (rangeEnd) {
                rangeStart = "normal";
                range = `${rangeStart} ${rangeEnd}`;
            }
        }
    }
    if (range) {
        options["animation-range"] = range;
    }

    return {
        timeline,
        options
    };
};

const changeAnimations = (e: HTMLElement) => {
    try {
        for (const a of e.getAnimations()) {
            if (a.playState !== "paused") {
                continue;
            }

            const { timeline, options } = createTimeline(e, a as CSSAnimation);
            if (!timeline) {
                return;
            }
            const na = new (Animation as any)(a.effect, timeline, options);
            na.play();
        }
    } catch (error) {
        console.error(error);        
    }

};

const main = () => {

    document.querySelectorAll("*").forEach(changeAnimations);

    const m = new MutationObserver((records) => {
        for (const { addedNodes, target } of records) {
            if (target) {
                changeAnimations(target as HTMLElement);
                continue;
            }
            addedNodes.forEach(changeAnimations);
        }
    });

    m.observe(document.body, {
        subtree: true,
        attributes: true
    });
    

};

onDomReady(main);
