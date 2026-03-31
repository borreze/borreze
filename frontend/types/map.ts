export interface MapMarkerPopup {
    label?: string
    content?: string
    icon?: string
}

export interface MapMarker {
    position: [number, number]
    popup?: MapMarkerPopup
}