import {
  inject,
  Injectable,
} from '@angular/core';
import { Quote } from '@app-quote-viewer/model';
import { QuoteViewerApiService } from '@app-quote-viewer/service/quote-viewer-api.service';
import { QuoteViewerActions } from '@app-quote-viewer/store/actions';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  concat,
  from,
  of,
  switchMap,
} from 'rxjs';

@Injectable()
export class QuoteViewerEffects {
  private readonly actions: Actions = inject(Actions);
  private readonly store: Store = inject(Store);
  private readonly quoteViewerApiService: QuoteViewerApiService = inject(QuoteViewerApiService);

  init$ = createEffect(
    () => this.actions
      .pipe(
        ofType(QuoteViewerActions.init),
        switchMap(
          () => {
            return concat(
              of(QuoteViewerActions.setLoading({ loading: true })),
              this.quoteViewerApiService.fetchQuote()
                .pipe(
                  switchMap(
                    (quote: Quote) => {
                      return from(
                        [
                          QuoteViewerActions.quoteFetchSuccess({ quote }),
                          QuoteViewerActions.setLoading({ loading: false }),
                        ],
                      );
                    },
                  ),
                  catchError(
                    () => {
                      return of(QuoteViewerActions.setLoading({ loading: false }));
                    },
                  ),
                ),
            );
          },
        ),
      ),
  );
}
