import {
  DisplayMode,
  Filter,
  Quote,
  SlideshowPlaybackState,
} from '@app-quote-viewer/model';
import { QuoteViewerStore } from '@app-quote-viewer/store/index';
import {
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

export module QuoteViewerSelectors {
  const selectState = createFeatureSelector<QuoteViewerStore.State>(QuoteViewerStore.key);
  export const selectSlideshowProgress = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => state.slideshowProgress,
  );
  export const selectFilter = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => state.filter,
  );
  export const selectQuoteList = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => state.quoteList,
  );
  export const selectFilteredQuoteList = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => {
      switch (state.filter) {
        case Filter.ALL:
          return state.quoteList;
        case Filter.BOOKMARKED:
          return state.bookmarkedQuoteList;
      }
    },
  );
  export const selectActiveIndex = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => state.activeIndex,
  );
  export const selectQuote = createSelector(
    selectFilteredQuoteList,
    selectActiveIndex,
    (
      quoteList: Quote[],
      activeIndex: number,
    ) => {
      return activeIndex > -1
        ? quoteList[activeIndex] || null
        : null;
    },
  );
  export const selectCanShowNext = createSelector(
    selectState,
    selectFilteredQuoteList,
    (
      state: QuoteViewerStore.State,
      quoteList: Quote[],
    ) => {
      switch (state.filter) {
        case Filter.ALL:
          return state.displayMode === DisplayMode.MANUAL && !state.isLoading;
        case Filter.BOOKMARKED:
          return state.activeIndex < quoteList.length - 1;
      }
    },
  );
  export const selectCanShowPrevious = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => {
      return state.displayMode === DisplayMode.MANUAL && state.activeIndex > 0;
    },
  );
  export const selectCanPlaySlideshow = createSelector(
    selectState,
    selectFilteredQuoteList,
    (
      state: QuoteViewerStore.State,
      quoteList: Quote[],
    ) => {
      return quoteList.length > 0
        && (
          state.displayMode !== DisplayMode.SLIDESHOW
          || state.slideshowPlaybackState === SlideshowPlaybackState.PAUSED
        );
    },
  );
  export const selectCanPauseSlideshow = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => {
      return state.displayMode === DisplayMode.SLIDESHOW && state.slideshowPlaybackState === SlideshowPlaybackState.PLAYING;
    },
  );
  export const selectCanStopSlideshow = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => {
      return state.displayMode === DisplayMode.SLIDESHOW;
    },
  );
  export const selectCanFilter = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => {
      return state.displayMode === DisplayMode.MANUAL;
    },
  );
  export const selectDisplayMode = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => state.displayMode,
  );
  export const selectSlideshowPlaybackState = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => state.slideshowPlaybackState,
  );
  export const selectIsLoading = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => state.isLoading,
  );
  export const selectBookmarkedQuoteList = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => state.bookmarkedQuoteList,
  );
  export const selectCanToggleBookmark = createSelector(
    selectQuote,
    (quote: Quote | null) => !!quote,
  );
}
