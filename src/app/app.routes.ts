import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'quote-viewer',
    loadComponent: () => import('@app-quote-viewer/component/quote-viewer-page/quote-viewer-page').then(m => m.QuoteViewerPage),
  },
  {
    path: '**',
    redirectTo: 'quote-viewer',
  },
];
