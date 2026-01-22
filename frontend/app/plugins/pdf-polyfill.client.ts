export default defineNuxtPlugin(() => {
    if (typeof Promise.withResolvers === "undefined") {
        if (typeof window !== "undefined") {
            // @ts-expect-error This is a polyfill
            window.Promise.withResolvers = function () {
                let resolve, reject;
                const promise = new Promise((res, rej) => {
                    resolve = res;
                    reject = rej;
                });
                return { promise, resolve, reject };
            };
        }
    }
});
