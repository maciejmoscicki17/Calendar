import { Component, OnInit } from '@angular/core'
import { LoaderService } from '../services/loader.service'

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    constructor(private loaderService: LoaderService) {}

    ngOnInit(): void {}

    onClick() {
        this.loaderService.shootLoader(3000)
    }
}
