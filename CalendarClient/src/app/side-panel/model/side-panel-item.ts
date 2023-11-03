export interface SidePanelItem {
    source: string
    label: string
    route?: string
    click?: (() => void) | null | undefined
}
