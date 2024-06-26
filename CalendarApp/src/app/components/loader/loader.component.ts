import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  showLoader: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
    this.showLoader = this.loaderService.loader$.asObservable();
  }
}
