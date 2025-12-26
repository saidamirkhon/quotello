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
import { QuoteViewerService } from '@app-quote-viewer/service/quote-viewer.service';
import { QuoteViewerActions } from '@app-quote-viewer/store/actions';
import { QuoteMapper } from '@app-quote-viewer/util';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import {
  catchError,
  concat,
  EMPTY,
  from,
  map,
  merge,
  Observable,
  of,
  retry,
  switchMap,
  take,
  throwIfEmpty,
  timer,
  withLatestFrom,
} from 'rxjs';

@Injectable()
export class QuoteViewerEffects {
  private readonly actions: Actions = inject(Actions);
  private readonly quoteViewerApiService: QuoteViewerApiService = inject(QuoteViewerApiService);
  private readonly quoteViewerService: QuoteViewerService = inject(QuoteViewerService);

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
              this.fetchQuote()
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
          this.quoteViewerService.activeIndex$,
          this.quoteViewerService.filteredQuoteList$,
          this.quoteViewerService.canShowNext$,
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
              this.fetchQuote()
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
          this.quoteViewerService.activeIndex$,
          this.quoteViewerService.canShowPrevious$,
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
          this.quoteViewerService.quote$,
          this.quoteViewerService.filteredQuoteList$,
          this.quoteViewerService.filter$,
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
          this.quoteViewerService.bookmarkedQuoteList$,
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
          this.quoteViewerService.filter$,
          this.quoteViewerService.quoteList$,
          this.quoteViewerService.bookmarkedQuoteList$,
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
          this.quoteViewerService.canPlaySlideshow$,
          this.quoteViewerService.canPauseSlideshow$,
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

  private fetchQuote(): Observable<Quote> {
    return merge(
      this.quoteViewerApiService
        .fetchQuoteFromDummyJson()
        .pipe(
          map(QuoteMapper.fromDummyJson),
          catchError(() => EMPTY),
        ),
      this.quoteViewerApiService
        .fetchQuoteFromQuotable()
        .pipe(
          map(QuoteMapper.fromQuotable),
          catchError(() => EMPTY),
        ),
      this.quoteViewerApiService
        .fetchQuoteFromQuoteSlate()
        .pipe(
          map(QuoteMapper.fromQuoteSlate),
          catchError(() => EMPTY),
        ),
    )
      .pipe(
        take(1),
        throwIfEmpty(() => new Error()),
        retry(
          {
            count: 10,
            delay: (
              error,
              retryCount,
            ) => {
              return timer(
                Math
                  .pow(
                    2,
                    retryCount - 1,
                  ) * 1000,
              );
            },
          },
        ),
      );
  }
}
