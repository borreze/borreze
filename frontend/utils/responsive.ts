export function isMobile(): boolean {
    if (!navigator || !navigator.userAgent) return false
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

export function isSm(): boolean {
    const mq = window.matchMedia('(min-width: 640px)')
    return mq?.matches || isMobile()
}

export function isMd(): boolean {
    const mq = window.matchMedia('(min-width: 768px)')
    return mq?.matches || isMobile()
}

export function isLg(): boolean {
    const mq = window.matchMedia('(min-width: 1024px)')
    return mq?.matches || isMobile()
}

export function isXl(): boolean {
    const mq = window.matchMedia('(min-width: 1280px)')
    return mq?.matches || isMobile()
}

export function is2Xl(): boolean {
    const mq = window.matchMedia('(min-width: 1536px)')
    return mq?.matches || isMobile()
}

export function getScreenSize(): 'sm' | 'md' | 'lg' | 'xl' | '2xl' {
    if (is2Xl()) return '2xl'
    if (isXl()) return 'xl'
    if (isLg()) return 'lg'
    if (isMd()) return 'md'
    return 'sm'
}