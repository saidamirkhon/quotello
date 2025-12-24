import { NgrxStoreKey } from '@app-model';
import { Quote } from '@app-quote-viewer/model';
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
    showOnlyBookmarked: boolean;
    isLoading: boolean;
  }

  const initialState: State = {
    quoteList: [
      {
        id: 1,
        text: 'text',
        author: 'author',
        isBookmarked: false,
      },
    ],
    activeIndex: 0,
    slideshowProgress: 80,
    showOnlyBookmarked: false,
    isLoading: false,
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
      QuoteViewerActions.quoteFetchSuccess,
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
  );
}
