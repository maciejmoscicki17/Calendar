import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'side-panel',
    templateUrl: './side-panel.component.html',
    styleUrls: ['./side-panel.component.scss'],
})
export class SidePanelComponent implements OnInit {
    isExpanded = false
    constructor() {}

    ngOnInit(): void {}

    expandCollapse() {
        this.isExpanded = !this.isExpanded
    }

    get expandCollapseText(): string {
        return this.isExpanded ? 'Collapse' : 'Expand'
    }
}
