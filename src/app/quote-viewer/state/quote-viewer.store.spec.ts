import {
  DisplayMode,
  Filter,
  Quote,
  SlideshowPlaybackState,
} from '@app-quote-viewer/model';
import { QuoteViewerActions } from '@app-quote-viewer/state/quote-viewer.actions';
import { QuoteViewerStore } from '@app-quote-viewer/state/quote-viewer.store';
import { getNgrxNoopAction } from '@app-util';
import { ActionReducer } from '@ngrx/store';
import {
  describe,
  expect,
} from 'vitest';

describe(
  'QuoteViewerStore',
  () => {
    let reducer: ActionReducer<QuoteViewerStore.State> = QuoteViewerStore.reducer;
    let currentState: QuoteViewerStore.State;
    const unbookmarkedQuote: Quote = {
      isBookmarked: false,
      id: '1',
      text: '',
      author: '',
    };
    const bookmarkedQuote: Quote = {
      isBookmarked: true,
      id: '1',
      text: '',
      author: '',
    };
    beforeEach(
      () => {
        currentState = reducer(
          QuoteViewerStore.initialState,
          getNgrxNoopAction(),
        );
      },
    );
    it(
      'should set isLoading on setIsLoading action',
      () => {
        const isLoading = true;
        currentState.isLoading = !isLoading;
        const nextState = reducer(
          currentState,
          QuoteViewerActions.setIsLoading({ isLoading }),
        );
        expect(nextState.isLoading)
          .toEqual(isLoading);
      },
    );
    it(
      'should set activeIndex on setActiveIndex action',
      () => {
        const activeIndex = -1;
        currentState.activeIndex = activeIndex + 1;
        const nextState = reducer(
          currentState,
          QuoteViewerActions.setActiveIndex({ activeIndex }),
        );
        expect(nextState.activeIndex)
          .toEqual(activeIndex);
      },
    );
    it(
      'should append quote to quote list on fetchQuoteSuccess action',
      () => {
        currentState.quoteList = [];
        const nextState = reducer(
          currentState,
          QuoteViewerActions.fetchQuoteSuccess({ quote: unbookmarkedQuote }),
        );
        expect(nextState.quoteList)
          .toEqual([unbookmarkedQuote]);
      },
    );
    it(
      'should set bookmarkedQuoteList on setBookmarkedQuoteList action',
      () => {
        currentState.bookmarkedQuoteList = [];
        const bookmarkedQuoteList: Quote[] = [];
        const nextState = reducer(
          currentState,
          QuoteViewerActions.setBookmarkedQuoteList({ bookmarkedQuoteList }),
        );
        expect(nextState.bookmarkedQuoteList)
          .toEqual(bookmarkedQuoteList);
      },
    );
    it(
      'should set isBookmarked property of quote to true on bookmark action',
      () => {
        currentState.quoteList = [unbookmarkedQuote];
        const nextState = reducer(
          currentState,
          QuoteViewerActions.bookmark({ quoteId: unbookmarkedQuote.id }),
        );
        expect(nextState.quoteList)
          .toEqual(
            [
              {
                ...unbookmarkedQuote,
                isBookmarked: true,
              },
            ],
          );
      },
    );
    it(
      'should append quote to bookmarkedQuoteList on bookmark action',
      () => {
        currentState.quoteList = [unbookmarkedQuote];
        currentState.bookmarkedQuoteList = [];
        const nextState = reducer(
          currentState,
          QuoteViewerActions.bookmark({ quoteId: unbookmarkedQuote.id }),
        );
        expect(nextState.bookmarkedQuoteList)
          .toEqual(
            [
              {
                ...unbookmarkedQuote,
                isBookmarked: true,
              },
            ],
          );
      },
    );
    it(
      'should set isBookmarked property of quote to false on unbookmark action',
      () => {
        currentState.quoteList = [bookmarkedQuote];
        const nextState = reducer(
          currentState,
          QuoteViewerActions.unbookmark({ quoteId: bookmarkedQuote.id }),
        );
        expect(nextState.quoteList)
          .toEqual([
            {
              ...bookmarkedQuote,
              isBookmarked: false,
            },
          ]);
      },
    );
    it(
      'should remove quote from bookmarkedQuoteList on unbookmark action',
      () => {
        currentState.bookmarkedQuoteList = [bookmarkedQuote];
        const nextState = reducer(
          currentState,
          QuoteViewerActions.unbookmark({ quoteId: bookmarkedQuote.id }),
        );
        expect(nextState.bookmarkedQuoteList)
          .toEqual([]);
      },
    );
    it(
      'should set filter on setFilter action',
      () => {
        currentState.filter = Filter.ALL;
        const nextState = reducer(
          currentState,
          QuoteViewerActions.setFilter({ filter: Filter.BOOKMARKED }),
        );
        expect(nextState.filter)
          .toEqual(Filter.BOOKMARKED);
      },
    );
    it(
      'should set slideshowPlaybackState to SlideshowPlaybackState.PLAYING on startSlideshow action',
      () => {
        currentState.slideshowPlaybackState = SlideshowPlaybackState.PAUSED;
        const nextState = reducer(
          currentState,
          QuoteViewerActions.startSlideshow(),
        );
        expect(nextState.slideshowPlaybackState)
          .toEqual(SlideshowPlaybackState.PLAYING);
      },
    );
    it(
      'should set displayMode to DisplayMode.SLIDESHOW on startSlideshow action',
      () => {
        currentState.displayMode = DisplayMode.MANUAL;
        const nextState = reducer(
          currentState,
          QuoteViewerActions.startSlideshow(),
        );
        expect(nextState.displayMode)
          .toEqual(DisplayMode.SLIDESHOW);
      },
    );
    it(
      'should set slideshowPlaybackState to SlideshowPlaybackState.PAUSED on pauseSlideshow action',
      () => {
        currentState.slideshowPlaybackState = SlideshowPlaybackState.PLAYING;
        const nextState = reducer(
          currentState,
          QuoteViewerActions.pauseSlideshow(),
        );
        expect(nextState.slideshowPlaybackState)
          .toEqual(SlideshowPlaybackState.PAUSED);
      },
    );
    it(
      'should set slideshowPlaybackState to SlideshowPlaybackState.PLAYING on resumeSlideshow action',
      () => {
        currentState.slideshowPlaybackState = SlideshowPlaybackState.PAUSED;
        const nextState = reducer(
          currentState,
          QuoteViewerActions.resumeSlideshow(),
        );
        expect(nextState.slideshowPlaybackState)
          .toEqual(SlideshowPlaybackState.PLAYING);
      },
    );
    it(
      'should set slideshowPlaybackState to SlideshowPlaybackState.PAUSED on stopSlideshow action',
      () => {
        currentState.slideshowPlaybackState = SlideshowPlaybackState.PLAYING;
        const nextState = reducer(
          currentState,
          QuoteViewerActions.stopSlideshow(),
        );
        expect(nextState.slideshowPlaybackState)
          .toEqual(SlideshowPlaybackState.PAUSED);
      },
    );
    it(
      'should set displayMode to DisplayMode.MANUAL on stopSlideshow action',
      () => {
        currentState.displayMode = DisplayMode.SLIDESHOW;
        const nextState = reducer(
          currentState,
          QuoteViewerActions.stopSlideshow(),
        );
        expect(nextState.displayMode)
          .toEqual(DisplayMode.MANUAL);
      },
    );
    it(
      'should set slideProgress to 0 on stopSlideshow action',
      () => {
        currentState.slideProgress = 100;
        const nextState = reducer(
          currentState,
          QuoteViewerActions.stopSlideshow(),
        );
        expect(nextState.slideProgress)
          .toEqual(0);
      },
    );
    it(
      'should set slideProgress on setSlideProgress action',
      () => {
        currentState.slideProgress = 0;
        const nextState = reducer(
          currentState,
          QuoteViewerActions.setSlideProgress({ slideProgress: 100 }),
        );
        expect(nextState.slideProgress)
          .toEqual(100);
      },
    );
    it(
      'should set slideStep on setSlideStep action',
      () => {
        currentState.slideStep = 0;
        const nextState = reducer(
          currentState,
          QuoteViewerActions.setSlideStep({ slideStep: 100 }),
        );
        expect(nextState.slideStep)
          .toEqual(100);
      },
    );
  },
);
