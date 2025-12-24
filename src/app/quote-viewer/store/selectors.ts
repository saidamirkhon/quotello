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
  export const selectShowOnlyBookmarked = createSelector(
    selectState,
    (state: QuoteViewerStore.State) => state.showOnlyBookmarked,
  );

}
