import { Route } from '@angular/router';
import { QuoteViewerPage } from '@app-quote-viewer/component/quote-viewer-page/quote-viewer-page';
import { QUOTE_PROVIDER_LIST_INJECTION_TOKEN } from '@app-quote-viewer/constant/quote-provider-list-injection-token';
import { DummyJsonApiService } from '@app-quote-viewer/service/dummy-json-api.service';
import { QuotableApiService } from '@app-quote-viewer/service/quotable-api.service';
import { QuoteSlateApiService } from '@app-quote-viewer/service/quote-slate-api.service';
import { QuoteViewerService } from '@app-quote-viewer/service/quote-viewer.service';
import { QuoteViewerEffects } from '@app-quote-viewer/state/quote-viewer.effects';
import { QuoteViewerStore } from '@app-quote-viewer/state/quote-viewer.store';
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
      QuoteViewerService,
      {
        provide: QUOTE_PROVIDER_LIST_INJECTION_TOKEN,
        useClass: QuotableApiService,
        multi: true,
      },
      {
        provide: QUOTE_PROVIDER_LIST_INJECTION_TOKEN,
        useClass: QuoteSlateApiService,
        multi: true,
      },
      {
        provide: QUOTE_PROVIDER_LIST_INJECTION_TOKEN,
        useClass: DummyJsonApiService,
        multi: true,
      },
    ],
    children: [
      {
        path: '',
        component: QuoteViewerPage,
      },
    ],
  },
];
