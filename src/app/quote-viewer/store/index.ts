import { NgrxStoreKey } from '@app-model';
import {
  DisplayMode,
  Filter,
  Quote,
  SlideshowPlaybackState,
} from '@app-quote-viewer/model';
import { QuoteViewerActions } from '@app-quote-viewer/store/actions';
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
    slideshowProgress: number;
    slideshowPlaybackState: SlideshowPlaybackState;
    filter: Filter;
    displayMode: DisplayMode;
    isLoading: boolean;
    bookmarkedQuoteList: Quote[];
  }

  const initialState: State = {
    quoteList: [],
    activeIndex: -1,
    slideshowProgress: 0,
    slideshowPlaybackState: SlideshowPlaybackState.PAUSED,
    filter: Filter.ALL,
    displayMode: DisplayMode.MANUAL,
    isLoading: false,
    bookmarkedQuoteList: [],
  };

  export const reducer: ActionReducer<State> = createReducer<State>(
    initialState,
    on(
      QuoteViewerActions.setLoading,
      (
        state: State,
        { loading },
      ): State => {
        return {
          ...state,
          isLoading: loading,
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
  );
}
