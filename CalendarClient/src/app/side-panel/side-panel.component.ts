import { Component, OnInit } from '@angular/core'
import { SidePanelItem } from './model/side-panel-item'

@Component({
    selector: 'side-panel',
    templateUrl: './side-panel.component.html',
    styleUrls: ['./side-panel.component.scss'],
})
export class SidePanelComponent implements OnInit {
    isExpanded = false

    sidePanelItems: SidePanelItem[] = [
        {
            label: 'Home',
            source: '../../assets/icons/house-solid.svg',
            route: '/',
        },
        {
            label: 'Calendar',
            source: '../../assets/icons/calendar-solid.svg',
            route: '/calendar',
        },
        {
            label: this.expandCollapseText,
            source: '../../assets/icons/angles-right-solid.svg',
            click: this.expandCollapse,
        },
    ]

    handleItemClick(item: SidePanelItem) {
        if (item.label === 'Collapse' || item.label === 'Expand') {
            this.expandCollapse()
        }

        if (this.expandCollapseText !== 'Collapse') {
            setTimeout(() => {
                this.updateLastLabel()
            }, 500)
        } else {
            this.updateLastLabel()
        }
    }

    updateLastLabel() {
        this.sidePanelItems[this.sidePanelItems.length - 1].label =
            this.expandCollapseText
    }
    constructor() {}

    ngOnInit(): void {}

    expandCollapse() {
        this.isExpanded = !this.isExpanded
    }

    get expandCollapseText(): string {
        return this.isExpanded ? 'Collapse' : 'Expand'
    }
}
