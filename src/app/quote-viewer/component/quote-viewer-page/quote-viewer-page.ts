import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { QuoteViewer } from '@app-quote-viewer/component/quote-viewer/quote-viewer';
import { QuoteViewerService } from '@app-quote-viewer/service/quote-viewer.service';

@Component(
  {
    selector: 'app-quote-viewer-page',
    templateUrl: './quote-viewer-page.html',
    imports: [
      QuoteViewer,
      AsyncPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
  },
)
export class QuoteViewerPage
  implements OnInit {
  readonly quoteViewerService: QuoteViewerService = inject(QuoteViewerService);

  ngOnInit(): void {
    this.quoteViewerService.init();
  }
}
