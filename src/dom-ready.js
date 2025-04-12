export const onDomReady = (resolve) => {

    if (document.readyState !== "loading") {
            resolve();
        return;
    }

    const d = () => {
        document.removeEventListener("DOMContentLoaded", d);
        resolve();
    };
    document.addEventListener("DOMContentLoaded", d);
};