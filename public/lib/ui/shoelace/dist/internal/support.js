export function isPreventScrollSupported() {
    let supported = false;
    document.createElement('div').focus({
        get preventScroll() {
            supported = true;
            return false;
        }
    });
    return supported;
}
