import {
  inject,
  Injectable,
} from '@angular/core';
import { LocalStorageKey } from '@app-model';
import { Quote } from '@app-quote-viewer/model';
import { QuoteViewerApiService } from '@app-quote-viewer/service/quote-viewer-api.service';
import { QuoteViewerActions } from '@app-quote-viewer/store/actions';
import { QuoteViewerSelectors } from '@app-quote-viewer/store/selectors';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import {
  Action,
  Store,
} from '@ngrx/store';
import {
  catchError,
  concat,
  EMPTY,
  from,
  Observable,
  of,
  switchMap,
  withLatestFrom,
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
            const actionList: Observable<Action>[] = [];
            const bookmarkedQuoteListRaw = localStorage.getItem(LocalStorageKey.BOOKMARKED_QUOTE_LIST);
            if (bookmarkedQuoteListRaw) {
              try {
                const bookmarkedQuoteList = JSON.parse(bookmarkedQuoteListRaw);
                if (Array.isArray(bookmarkedQuoteList) && bookmarkedQuoteList.length > 0) {
                  actionList.push(of(QuoteViewerActions.setBookmarkedQuoteList({ bookmarkedQuoteList })));
                }
              } catch (e) {
              }
            }
            actionList.push(
              of(QuoteViewerActions.setLoading({ loading: true })),
              this.quoteViewerApiService.fetchQuote()
                .pipe(
                  switchMap(
                    (quote: Quote) => {
                      return from(
                        [
                          QuoteViewerActions.fetchQuoteSuccess({ quote }),
                          QuoteViewerActions.setLoading({ loading: false }),
                          QuoteViewerActions.setActiveIndex({ activeIndex: 0 }),
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
            return concat(
              ...actionList,
            );
          },
        ),
      ),
  );

  showNext$ = createEffect(
    () => this.actions
      .pipe(
        ofType(QuoteViewerActions.showNext),
        withLatestFrom(
          this.store.select(QuoteViewerSelectors.selectActiveIndex),
          this.store.select(QuoteViewerSelectors.selectQuoteList),
          this.store.select(QuoteViewerSelectors.selectCanShowNext),
        ),
        switchMap(
          (
            [
              _,
              activeIndex,
              quoteList,
              canShowNext,
            ]: [
              Action,
              number,
              Quote[],
              boolean,
            ],
          ) => {
            const newActiveIndex = activeIndex + 1;
            if (canShowNext && newActiveIndex <= quoteList.length - 1) {
              return of(QuoteViewerActions.setActiveIndex({ activeIndex: newActiveIndex }));
            }
            return concat(
              of(QuoteViewerActions.setLoading({ loading: true })),
              this.quoteViewerApiService.fetchQuote()
                .pipe(
                  switchMap(
                    (quote: Quote) => {
                      return from(
                        [
                          QuoteViewerActions.fetchQuoteSuccess({ quote }),
                          QuoteViewerActions.setLoading({ loading: false }),
                          QuoteViewerActions.setActiveIndex({ activeIndex: newActiveIndex }),
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

  showPrevious$ = createEffect(
    () => this.actions
      .pipe(
        ofType(QuoteViewerActions.showPrevious),
        withLatestFrom(
          this.store.select(QuoteViewerSelectors.selectActiveIndex),
          this.store.select(QuoteViewerSelectors.selectCanShowPrevious),
        ),
        switchMap(
          (
            [
              _,
              activeIndex,
              canShowPrevious,
            ]: [
              Action,
              number,
              boolean
            ],
          ) => {
            if (canShowPrevious) {
              return of(QuoteViewerActions.setActiveIndex({ activeIndex: activeIndex - 1 }));
            }
            return EMPTY;
          },
        ),
      ),
  );
}
