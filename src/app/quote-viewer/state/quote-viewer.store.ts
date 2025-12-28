import { NgrxStoreKey } from '@app-model';
import {
  DisplayMode,
  Filter,
  Quote,
  SlideshowPlaybackState,
} from '@app-quote-viewer/model';
import { QuoteViewerActions } from '@app-quote-viewer/state/quote-viewer.actions';
import {
  ActionReducer,
  createReducer,
  on,
} from '@ngrx/store';

export module QuoteViewerStore {
  export const key = NgrxStoreKey.QUOTE_VIEWER;

  export interface State {
    quoteList: Quote[];
    activeIndex: number;
    slideProgress: number;
    slideshowPlaybackState: SlideshowPlaybackState;
    filter: Filter;
    displayMode: DisplayMode;
    isLoading: boolean;
    bookmarkedQuoteList: Quote[];
    slideStep: number;
  }

  export const initialState: State = {
    quoteList: [],
    activeIndex: -1,
    slideProgress: 0,
    slideshowPlaybackState: SlideshowPlaybackState.PAUSED,
    filter: Filter.ALL,
    displayMode: DisplayMode.MANUAL,
    isLoading: false,
    bookmarkedQuoteList: [],
    slideStep: 0,
  };

  export const reducer: ActionReducer<State> = createReducer<State>(
    initialState,
    on(
      QuoteViewerActions.setIsLoading,
      (
        state: State,
        { isLoading },
      ): State => {
        return {
          ...state,
          isLoading,
        };
      },
    ),
    on(
      QuoteViewerActions.setActiveIndex,
      (
        state: State,
        { activeIndex },
      ): State => {
        return {
          ...state,
          activeIndex,
        };
      },
    ),
    on(
      QuoteViewerActions.fetchQuoteSuccess,
      (
        state: State,
        { quote },
      ) => {
        return {
          ...state,
          quoteList: [
            ...state.quoteList,
            quote,
          ],
        };
      },
    ),
    on(
      QuoteViewerActions.setBookmarkedQuoteList,
      (
        state: State,
        { bookmarkedQuoteList },
      ): State => {
        return {
          ...state,
          bookmarkedQuoteList,
        };
      },
    ),
    on(
      QuoteViewerActions.bookmark,
      (
        state: State,
        { quoteId },
      ): State => {
        let bookmarkedQuoteIndex = -1;
        return {
          ...state,
          quoteList: state.quoteList
            .map(
              (
                quote: Quote,
                index: number,
              ) => {
                if (quote.id === quoteId) {
                  bookmarkedQuoteIndex = index;
                  return {
                    ...quote,
                    isBookmarked: true,
                  };
                }
                return quote;
              },
            ),
          bookmarkedQuoteList: [
            ...state.bookmarkedQuoteList,
            {
              ...state.quoteList[bookmarkedQuoteIndex],
              isBookmarked: true,
            },
          ],
        };
      },
    ),
    on(
      QuoteViewerActions.unbookmark,
      (
        state: State,
        { quoteId },
      ): State => {
        return {
          ...state,
          quoteList: state.quoteList
            .map(
              (quote: Quote) => {
                if (quote.id === quoteId) {
                  return {
                    ...quote,
                    isBookmarked: false,
                  };
                }
                return quote;
              },
            ),
          bookmarkedQuoteList: state.bookmarkedQuoteList.filter((quote: Quote) => quote.id !== quoteId),
        };
      },
    ),
    on(
      QuoteViewerActions.setFilter,
      (
        state: State,
        { filter },
      ): State => {
        return {
          ...state,
          filter,
        };
      },
    ),
    on(
      QuoteViewerActions.startSlideshow,
      (state: State): State => {
        return {
          ...state,
          slideshowPlaybackState: SlideshowPlaybackState.PLAYING,
          displayMode: DisplayMode.SLIDESHOW,
        };
      },
    ),
    on(
      QuoteViewerActions.pauseSlideshow,
      (state: State): State => {
        return {
          ...state,
          slideshowPlaybackState: SlideshowPlaybackState.PAUSED,
        };
      },
    ),
    on(
      QuoteViewerActions.resumeSlideshow,
      (state: State): State => {
        return {
          ...state,
          slideshowPlaybackState: SlideshowPlaybackState.PLAYING,
        };
      },
    ),
    on(
      QuoteViewerActions.stopSlideshow,
      (state: State): State => {
        return {
          ...state,
          slideshowPlaybackState: SlideshowPlaybackState.PAUSED,
          displayMode: DisplayMode.MANUAL,
          slideProgress: 0,
        };
      },
    ),
    on(
      QuoteViewerActions.setSlideProgress,
      (
        state: State,
        { slideProgress },
      ): State => {
        return {
          ...state,
          slideProgress,
        };
      },
    ),
    on(
      QuoteViewerActions.setSlideStep,
      (
        state: State,
        { slideStep },
      ): State => {
        return {
          ...state,
          slideStep,
        };
      },
    ),
  );
}
