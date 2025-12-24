import { Routes } from '@angular/router';
import { QuoteViewerApiService } from '@app-quote-viewer/service/quote-viewer-api.service';
import { QuoteViewerService } from '@app-quote-viewer/service/quote-viewer.service';
import { QuoteViewerStore } from '@app-quote-viewer/store';
import { QuoteViewerEffects } from '@app-quote-viewer/store/effects';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

export const routes: Routes = [
  {
    path: 'quote-viewer',
    loadComponent: () => import('@app-quote-viewer/component/quote-viewer-page/quote-viewer-page').then(m => m.QuoteViewerPage),
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
  },
  {
    path: '**',
    redirectTo: 'quote-viewer',
  },
];
