export function isMobile(): boolean {
    if (!navigator || !navigator.userAgent) return false
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}