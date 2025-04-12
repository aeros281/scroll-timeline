export const resolveStyleValue = (style: CSSStyleDeclaration, name: string) => {
    const v = style.getPropertyValue(name);
    if (v.startsWith("--")) {
        return resolveStyleValue(style, v);
    }
    return v;
};