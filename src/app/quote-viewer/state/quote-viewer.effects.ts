import {
  inject,
  Injectable,
} from '@angular/core';
import { LocalStorageKey } from '@app-model';
import { SLIDE_DISPLAY_DURATION_IN_MS } from '@app-quote-viewer/constant';
import {
  DisplayMode,
  Filter,
  Quote,
  SlideshowPlaybackState,
} from '@app-quote-viewer/model';
import { QuoteViewerApiService } from '@app-quote-viewer/service/quote-viewer-api.service';
import { QuoteViewerService } from '@app-quote-viewer/service/quote-viewer.service';
import { QuoteViewerActions } from '@app-quote-viewer/state/quote-viewer.actions';
import { QuoteMapper } from '@app-quote-viewer/util';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import {
  catchError,
  combineLatest,
  concat,
  EMPTY,
  filter,
  from,
  map,
  merge,
  Observable,
  of,
  retry,
  scan,
  switchMap,
  take,
  takeUntil,
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
          this.quoteViewerService.slideshowPlaybackState$,
        ),
        switchMap(
          (
            [
              _,
              activeIndex,
              filteredQuoteList,
              slideshowPlaybackState,
            ]: [
              Action,
              number,
              Quote[],
              SlideshowPlaybackState,
            ],
          ) => {
            const newActiveIndex = activeIndex + 1;
            if (newActiveIndex <= filteredQuoteList.length - 1) {
              const actionList: Action[] = [
                QuoteViewerActions.setActiveIndex({ activeIndex: newActiveIndex }),
              ];
              if (slideshowPlaybackState === SlideshowPlaybackState.PLAYING) {
                actionList.push(QuoteViewerActions.playSlide());
              }
              return from(actionList);
            }
            return concat(
              of(QuoteViewerActions.setIsLoading({ isLoading: true })),
              this.fetchQuote()
                .pipe(
                  switchMap(
                    (quote: Quote) => {
                      const actionList: Action[] = [
                        QuoteViewerActions.fetchQuoteSuccess({ quote }),
                        QuoteViewerActions.setIsLoading({ isLoading: false }),
                        QuoteViewerActions.setActiveIndex({ activeIndex: newActiveIndex }),
                      ];
                      if (slideshowPlaybackState === SlideshowPlaybackState.PLAYING) {
                        actionList
                          .push(
                            QuoteViewerActions.playSlide(),
                          );
                      }
                      return from(
                        actionList,
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
          this.quoteViewerService.activeIndex$,
        ),
        switchMap(
          (
            [
              _,
              quote,
              filteredQuoteList,
              filter,
              activeIndex,
            ]: [
              Action,
                Quote | null,
              Quote[],
              Filter,
              number,
            ],
          ) => {
            if (!quote) {
              return EMPTY;
            }
            const actionList$: Observable<Action>[] = [];
            if (quote.isBookmarked) {
              actionList$.push(of(QuoteViewerActions.unbookmark({ quoteId: quote.id })));
              if (filter === Filter.BOOKMARKED) {
                actionList$
                  .push(
                    of(
                      QuoteViewerActions
                        .setActiveIndex(
                          {
                            activeIndex: filteredQuoteList.length === 1
                              ? -1
                              : activeIndex - 1,
                          },
                        ),
                    ),
                  );
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
          this.quoteViewerService.slideshowPlaybackState$,
          this.quoteViewerService.displayMode$,
        ),
        switchMap(
          (
            [
              _,
              canPlaySlideshow,
              canPauseSlideshow,
              slideshowPlaybackState,
              displayMode,
            ]: [
              Action,
              boolean,
              boolean,
              SlideshowPlaybackState,
              DisplayMode,
            ],
          ) => {
            if (!canPlaySlideshow && !canPauseSlideshow) {
              return EMPTY;
            }
            switch (slideshowPlaybackState) {
              case SlideshowPlaybackState.PAUSED:
                switch (displayMode) {
                  case DisplayMode.MANUAL:
                    return of(QuoteViewerActions.startSlideshow());
                  case DisplayMode.SLIDESHOW:
                    return of(QuoteViewerActions.resumeSlideshow());
                  default:
                    return EMPTY;
                }
              case SlideshowPlaybackState.PLAYING:
                return of(QuoteViewerActions.pauseSlideshow());
            }
          },
        ),
      ),
  );

  startSlideshow$ = createEffect(
    () => this.actions
      .pipe(
        ofType(QuoteViewerActions.startSlideshow),
        switchMap(
          () => {
            return of(QuoteViewerActions.playSlide());
          },
        ),
      ),
  );

  playSlide$ = createEffect(
    () => this.actions
      .pipe(
        ofType(QuoteViewerActions.playSlide),
        switchMap(
          () => {
            return concat(
              of(QuoteViewerActions.setSlideProgress({ slideProgress: 0 })),
              this.getPlaySlideFlow$(),
            );
          },
        ),
      ),
  );

  resumeSlideshow$ = createEffect(
    () => this.actions
      .pipe(
        ofType(QuoteViewerActions.resumeSlideshow),
        withLatestFrom(
          this.quoteViewerService.slideStep$,
        ),
        switchMap(
          (
            [
              _,
              slideStep,
            ]: [
              Action,
              number,
            ],
          ) => {
            return this.getPlaySlideFlow$(slideStep);
          },
        ),
      ),
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

  private getPlaySlideFlow$(startFromStep = 0): Observable<Action> {
    const rateInMs = 200;
    const numSteps = Math.floor(SLIDE_DISPLAY_DURATION_IN_MS / rateInMs);
    return timer(
      0,
      rateInMs,
    )
      .pipe(
        take(numSteps - startFromStep),
        scan(
          (currentStep: number) => currentStep + 1,
          startFromStep,
        ),
        withLatestFrom(
          this.quoteViewerService.filter$,
          this.quoteViewerService.activeIndex$,
          this.quoteViewerService.bookmarkedQuoteList$,
        ),
        switchMap(
          (
            [
              currentStep,
              filter,
              activeIndex,
              bookmarkedQuoteList,
            ]: [
              number,
              Filter,
              number,
              Quote[],
            ],
          ) => {
            const actionList$: Observable<Action>[] = [];
            const isLastStep = currentStep === numSteps;
            if (isLastStep) {
              actionList$.push(
                of(QuoteViewerActions.setSlideProgress({ slideProgress: 100 })),
              );
              const canShowNext = filter === Filter.BOOKMARKED
                ? activeIndex < bookmarkedQuoteList.length - 1
                : true;
              if (canShowNext) {
                actionList$.push(
                  of(QuoteViewerActions.showNext()),
                );
              } else {
                actionList$.push(of(QuoteViewerActions.stopSlideshow()));
              }
            } else {
              actionList$.push(
                of(QuoteViewerActions.setSlideProgress({ slideProgress: Math.ceil((currentStep / numSteps) * 100) })),
              );
            }
            actionList$
              .push(
                of(QuoteViewerActions.setSlideStep({ slideStep: currentStep })),
              );
            return concat(
              ...actionList$,
            );
          },
        ),
        takeUntil(
          combineLatest(
            [
              this.quoteViewerService.displayMode$,
              this.quoteViewerService.slideshowPlaybackState$,
            ],
          )
            .pipe(
              filter(
                (
                  [
                    displayMode,
                    slideshowPlaybackState,
                  ]: [
                    DisplayMode,
                    SlideshowPlaybackState
                  ],
                ) => {
                  return displayMode !== DisplayMode.SLIDESHOW || slideshowPlaybackState !== SlideshowPlaybackState.PLAYING;
                },
              ),
            ),
        ),
      );
  }
}
