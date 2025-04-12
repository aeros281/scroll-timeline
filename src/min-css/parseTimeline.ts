import { resolveStyleValue } from "./resolveStyleValue";

/** This object provides methods to parse values needed for Timeline options */
export const parseTimeline = (style: CSSStyleDeclaration, name: string) => {
    const v = resolveStyleValue(style, `--${name}-animation-timeline`);
    const r = /(view|scroll)(\(([^\)]+)\))?/gm.exec(v);
    if (!r?.length) {
        return {};
    }
    const {
        1: timelineName, 3: args
    } = r;

    const a = args?.split(" ") ?? [];

    let axis = "block";

    if (timelineName === "view") {
        let inset;
        for (const av of a) {
            if (/^(block|inline|x|y)$/.test(av)) {
                axis = av;
                continue;
            }
            inset ??= [];
            inset.push(av);
        }
        return {
            view: {
                axis,
                inset
            }
        };
    }

    let scroller = "nearest";

    for (const av of a) {
        if (/^(block|inline|x|y)$/.test(av)) {
            axis = av;
            continue;
        }
        scroller = av;
    }

    return {
        scroll: {
            scroller,
            axis
        }
    };
};
