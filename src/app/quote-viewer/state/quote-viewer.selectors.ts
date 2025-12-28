import {
  DisplayMode,
  Filter,
  Quote,
  SlideshowPlaybackState,
} from '@app-quote-viewer/model';
import { QuoteViewerStore } from '@app-quote-viewer/state/quote-viewer.store';
import {
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

export module QuoteViewerSelectors {
  const selectState = createFeatureSelector<QuoteViewerStore.State>(QuoteViewerStore.key);
  export const selectSlideProgress = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => state.slideProgress,
  );
  export const selectSlideshowPlaybackState = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => state.slideshowPlaybackState,
  );
  export const selectFilter = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => state.filter,
  );
  export const selectQuoteList = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => state.quoteList,
  );
  export const selectBookmarkedQuoteList = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => state.bookmarkedQuoteList,
  );
  export const selectActiveIndex = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => state.activeIndex,
  );
  export const selectDisplayMode = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => state.displayMode,
  );
  export const selectIsLoading = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => state.isLoading,
  );
  export const selectSlideStep = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => state.slideStep,
  );
  export const selectFilteredQuoteList = createSelector(
    selectFilter,
    selectQuoteList,
    selectBookmarkedQuoteList,
    (
      filter: Filter,
      quoteList: Quote[],
      bookmarkedQuoteList: Quote[],
    ) => {
      switch (filter) {
        case Filter.ALL:
          return quoteList;
        case Filter.BOOKMARKED:
          return bookmarkedQuoteList;
      }
    },
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
    selectFilter,
    selectBookmarkedQuoteList,
    selectDisplayMode,
    selectIsLoading,
    selectActiveIndex,
    (
      filter: Filter,
      bookmarkedQuoteList: Quote[],
      displayMode: DisplayMode,
      isLoading: boolean,
      activeIndex: number,
    ) => {
      switch (filter) {
        case Filter.ALL:
          return displayMode === DisplayMode.MANUAL && !isLoading;
        case Filter.BOOKMARKED:
          return displayMode === DisplayMode.MANUAL && activeIndex < bookmarkedQuoteList.length - 1;
      }
    },
  );
  export const selectCanShowPrevious = createSelector(
    selectDisplayMode,
    selectActiveIndex,
    (
      displayMode: DisplayMode,
      activeIndex: number,
    ) => {
      return displayMode === DisplayMode.MANUAL && activeIndex > 0;
    },
  );
  export const selectCanPlaySlideshow = createSelector(
    selectDisplayMode,
    selectFilteredQuoteList,
    selectSlideshowPlaybackState,
    (
      displayMode: DisplayMode,
      filteredQuoteList: Quote[],
      slideshowPlaybackState: SlideshowPlaybackState,
    ) => {
      return filteredQuoteList.length > 0
        && (
          displayMode !== DisplayMode.SLIDESHOW
          || slideshowPlaybackState === SlideshowPlaybackState.PAUSED
        );
    },
  );
  export const selectCanPauseSlideshow = createSelector(
    selectDisplayMode,
    selectSlideshowPlaybackState,
    (
      displayMode: DisplayMode,
      slideshowPlaybackState: SlideshowPlaybackState,
    ) => {
      return displayMode === DisplayMode.SLIDESHOW && slideshowPlaybackState === SlideshowPlaybackState.PLAYING;
    },
  );
  export const selectCanStopSlideshow = createSelector(
    selectDisplayMode,
    (displayMode: DisplayMode) => {
      return displayMode === DisplayMode.SLIDESHOW;
    },
  );
  export const selectCanFilter = createSelector(
    selectDisplayMode,
    (displayMode: DisplayMode) => {
      return displayMode === DisplayMode.MANUAL;
    },
  );
  export const selectCanToggleBookmark = createSelector(
    selectQuote,
    selectDisplayMode,
    selectFilter,
    (
      quote: Quote | null,
      displayMode: DisplayMode,
      filter: Filter,
    ) => !!quote && (displayMode === DisplayMode.MANUAL || filter === Filter.ALL),
  );
}
