import {
  inject,
  Injectable,
} from '@angular/core';
import { LocalStorageKey } from '@app-model';
import {
  Filter,
  Quote,
} from '@app-quote-viewer/model';
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
            const actionList$: Observable<Action>[] = [];
            const bookmarkedQuoteListRaw = localStorage.getItem(LocalStorageKey.BOOKMARKED_QUOTE_LIST);
            if (bookmarkedQuoteListRaw) {
              try {
                const bookmarkedQuoteList = JSON.parse(bookmarkedQuoteListRaw);
                if (Array.isArray(bookmarkedQuoteList) && bookmarkedQuoteList.length > 0) {
                  actionList$.push(of(QuoteViewerActions.setBookmarkedQuoteList({ bookmarkedQuoteList })));
                }
              } catch (e) {
              }
            }
            actionList$.push(
              of(QuoteViewerActions.setIsLoading({ isLoading: true })),
              this.quoteViewerApiService.fetchQuote()
                .pipe(
                  switchMap(
                    (quote: Quote) => {
                      return from(
                        [
                          QuoteViewerActions.fetchQuoteSuccess({ quote }),
                          QuoteViewerActions.setIsLoading({ isLoading: false }),
                          QuoteViewerActions.setActiveIndex({ activeIndex: 0 }),
                        ],
                      );
                    },
                  ),
                  catchError(
                    () => {
                      return of(QuoteViewerActions.setIsLoading({ isLoading: false }));
                    },
                  ),
                ),
            );
            return concat(
              ...actionList$,
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
          this.store.select(QuoteViewerSelectors.selectFilteredQuoteList),
          this.store.select(QuoteViewerSelectors.selectCanShowNext),
        ),
        switchMap(
          (
            [
              _,
              activeIndex,
              filteredQuoteList,
              canShowNext,
            ]: [
              Action,
              number,
              Quote[],
              boolean,
            ],
          ) => {
            const newActiveIndex = activeIndex + 1;
            if (canShowNext && newActiveIndex <= filteredQuoteList.length - 1) {
              return of(QuoteViewerActions.setActiveIndex({ activeIndex: newActiveIndex }));
            }
            return concat(
              of(QuoteViewerActions.setIsLoading({ isLoading: true })),
              this.quoteViewerApiService.fetchQuote()
                .pipe(
                  switchMap(
                    (quote: Quote) => {
                      return from(
                        [
                          QuoteViewerActions.fetchQuoteSuccess({ quote }),
                          QuoteViewerActions.setIsLoading({ isLoading: false }),
                          QuoteViewerActions.setActiveIndex({ activeIndex: newActiveIndex }),
                        ],
                      );
                    },
                  ),
                  catchError(
                    () => {
                      return of(QuoteViewerActions.setIsLoading({ isLoading: false }));
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

  toggleBookmark$ = createEffect(
    () => this.actions
      .pipe(
        ofType(QuoteViewerActions.toggleBookmark),
        withLatestFrom(
          this.store.select(QuoteViewerSelectors.selectQuote),
          this.store.select(QuoteViewerSelectors.selectFilteredQuoteList),
          this.store.select(QuoteViewerSelectors.selectFilter),
        ),
        switchMap(
          (
            [
              _,
              quote,
              filteredQuoteList,
              filter,
            ]: [
              Action,
                Quote | null,
              Quote[],
              Filter,
            ],
          ) => {
            if (!quote) {
              return EMPTY;
            }
            const actionList$: Observable<Action>[] = [];
            if (quote.isBookmarked) {
              actionList$.push(of(QuoteViewerActions.unbookmark({ quoteId: quote.id })));
              if (filter === Filter.BOOKMARKED && filteredQuoteList.length === 1) {
                actionList$.push(of(QuoteViewerActions.setActiveIndex({ activeIndex: -1 })));
              }
            } else {
              actionList$.push(of(QuoteViewerActions.bookmark({ quoteId: quote.id })));
            }
            actionList$.push(of(QuoteViewerActions.saveBookmarkedQuoteListToLocalStorage()));
            return concat(...actionList$);
          },
        ),
      ),
  );

  saveBookmarkedQuoteListToLocalStorage$ = createEffect(
    () => this.actions
      .pipe(
        ofType(QuoteViewerActions.saveBookmarkedQuoteListToLocalStorage),
        withLatestFrom(
          this.store.select(QuoteViewerSelectors.selectBookmarkedQuoteList),
        ),
        switchMap(
          (
            [
              _,
              bookmarkedQuoteList,
            ]: [
              Action,
              Quote[]
            ],
          ) => {
            localStorage.setItem(
              LocalStorageKey.BOOKMARKED_QUOTE_LIST,
              JSON.stringify(bookmarkedQuoteList),
            );
            return EMPTY;
          },
        ),
      ),
    { dispatch: false },
  );

  toggleFilter$ = createEffect(
    () => this.actions
      .pipe(
        ofType(QuoteViewerActions.toggleFilter),
        withLatestFrom(
          this.store.select(QuoteViewerSelectors.selectFilter),
          this.store.select(QuoteViewerSelectors.selectQuoteList),
          this.store.select(QuoteViewerSelectors.selectBookmarkedQuoteList),
        ),
        switchMap(
          (
            [
              _,
              filter,
              quoteList,
              bookmarkedQuoteList,
            ]: [
              Action,
              Filter,
              Quote[],
              Quote[],
            ],
          ) => {
            const actionList$: Observable<Action>[] = [];
            switch (filter) {
              case Filter.ALL:
                actionList$
                  .push(
                    of(
                      QuoteViewerActions
                        .setFilter(
                          { filter: Filter.BOOKMARKED },
                        ),
                    ),
                    of(
                      QuoteViewerActions
                        .setActiveIndex(
                          {
                            activeIndex: bookmarkedQuoteList.length === 0
                              ? -1
                              : 0,
                          },
                        ),
                    ),
                  );
                break;
              case Filter.BOOKMARKED:
                actionList$
                  .push(
                    of(
                      QuoteViewerActions
                        .setFilter
                        (
                          { filter: Filter.ALL },
                        ),
                    ),
                    of(
                      QuoteViewerActions
                        .setActiveIndex(
                          {
                            activeIndex: quoteList.length === 0
                              ? -1
                              : 0,
                          },
                        ),
                    ),
                  );
                break;
            }
            return concat(...actionList$);
          },
        ),
      ),
  );

  toggleSlideshowPlayback$ = createEffect(
    () => this.actions
      .pipe(
        ofType(QuoteViewerActions.toggleSlideshowPlayback),
        withLatestFrom(
          this.store.select(QuoteViewerSelectors.selectCanPlaySlideshow),
          this.store.select(QuoteViewerSelectors.selectCanPauseSlideshow),
        ),
        switchMap(
          (
            [
              _,
              canPlaySlideshow,
              canPauseSlideshow,
            ]: [
              Action,
              boolean,
              boolean,
            ],
          ) => {
            if (!canPlaySlideshow && !canPauseSlideshow) {
              return EMPTY;
            }
            if (canPlaySlideshow) {

            }
            return EMPTY;
          },
        ),
      ),
    {
      dispatch: false,
    },
  );
}
