import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { QuoteViewerApiService } from '@app-quote-viewer/service/quote-viewer-api.service';
import { QuoteViewerService } from '@app-quote-viewer/service/quote-viewer.service';

@Component(
  {
    selector: 'app-quote-viewer-page',
    templateUrl: './quote-viewer-page.html',
    providers: [
      QuoteViewerApiService,
      QuoteViewerService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
  },
)
export class QuoteViewerPage
  implements OnInit {
  private readonly quoteViewerService: QuoteViewerService = inject(QuoteViewerService);

  ngOnInit(): void {
    this.quoteViewerService.init();
  }
}
