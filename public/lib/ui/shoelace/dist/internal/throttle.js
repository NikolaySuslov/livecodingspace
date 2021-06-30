export function debounce(callback, delay) {
    let timer;
    return function () {
        if (timer) {
            return;
        }
        callback.apply(this, arguments);
        timer = setTimeout(() => (timer = null), delay);
    };
}
export function throttle(callback, delay) {
    let isThrottled = false;
    let args;
    let context;
    function wrapper() {
        if (isThrottled) {
            args = arguments;
            context = this;
            return;
        }
        isThrottled = true;
        callback.apply(this, arguments);
        setTimeout(() => {
            isThrottled = false;
            if (args) {
                wrapper.apply(context, args);
                args = context = null;
            }
        }, delay);
    }
    return wrapper;
}
