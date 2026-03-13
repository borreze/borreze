export interface MarkerPopup {
    label?: string
    content?: string
    icon?: string
}

export interface MapMarker {
    position: [number, number]
    color?: string
    popup?: MarkerPopup
}