export function isMobile(): boolean { // ! Use with caution, cause it can cause hydration issues if used in SSR context without proper handling
    if (!navigator || !navigator.userAgent) return false
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}