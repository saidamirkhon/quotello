import { Route } from '@angular/router';
import { QuoteViewerPage } from '@app-quote-viewer/component/quote-viewer-page/quote-viewer-page';
import { QuoteViewerApiService } from '@app-quote-viewer/service/quote-viewer-api.service';
import { QuoteViewerService } from '@app-quote-viewer/service/quote-viewer.service';
import { QuoteViewerStore } from '@app-quote-viewer/store';
import { QuoteViewerEffects } from '@app-quote-viewer/store/effects';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

export const QUOTE_VIEWER_ROUTES: Route[] = [
  {
    path: '',
    providers: [
      provideState(
        {
          name: QuoteViewerStore.key,
          reducer: QuoteViewerStore.reducer,
        },
      ),
      provideEffects(QuoteViewerEffects),
      QuoteViewerApiService,
      QuoteViewerService,
    ],
    children: [
      {
        path: '',
        component: QuoteViewerPage,
      },
    ],
  },
];
