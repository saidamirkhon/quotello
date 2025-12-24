import { Quote } from '@app-quote-viewer/model';
import {
  createAction,
  props,
} from '@ngrx/store';

export module QuoteViewerActions {
  export const init = createAction(
    '[Quote Viewer] Init',
  );
  export const setLoading = createAction(
    '[Quote Viewer] Set loading',
    props<{
      loading: boolean;
    }>(),
  );
  export const quoteFetchSuccess = createAction(
    '[Quote Viewer] Quote fetch success',
    props<{
      quote: Quote;
    }>(),
  );
}
