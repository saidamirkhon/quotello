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
  export const fetchQuoteSuccess = createAction(
    '[Quote Viewer] Fetch quote success',
    props<{
      quote: Quote;
    }>(),
  );
  export const toggleFilter = createAction(
    '[Quote Viewer] Toggle filter',
  );
  export const stopSlideshow = createAction(
    '[Quote Viewer] Stop slideshow',
  );
  export const toggleSlideshowPlayback = createAction(
    '[Quote Viewer] Toggle slideshow playback',
  );
  export const toggleBookmark = createAction(
    '[Quote Viewer] Toggle bookmark',
  );
  export const showNext = createAction(
    '[Quote Viewer] Show next',
  );
  export const showPrevious = createAction(
    '[Quote Viewer] Show previous',
  );
  export const setBookmarkedQuoteList = createAction(
    '[Quote Viewer] Set bookmarked quote list',
    props<{
      bookmarkedQuoteList: Quote[];
    }>(),
  );
  export const setActiveIndex = createAction(
    '[Quote Viewer] Set active index',
    props<{
      activeIndex: number;
    }>(),
  );
}
