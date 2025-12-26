import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'quote-viewer',
    loadChildren: () => import('@app-quote-viewer/constant/quote-viewer-routes').then(m => m.QUOTE_VIEWER_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'quote-viewer',
  },
];
