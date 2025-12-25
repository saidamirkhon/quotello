import {
  inject,
  Injectable,
} from '@angular/core';
import {
  Filter,
  Quote,
} from '@app-quote-viewer/model';
import { QuoteViewerActions } from '@app-quote-viewer/store/actions';
import { QuoteViewerSelectors } from '@app-quote-viewer/store/selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable()
export class QuoteViewerService {
  private readonly store = inject(Store);
  readonly quote$: Observable<Quote | null> = this.store.select(QuoteViewerSelectors.selectQuote);
  readonly slideshowProgress$: Observable<number> = this.store.select(QuoteViewerSelectors.selectSlideshowProgress);
  readonly canShowNext$: Observable<boolean> = this.store.select(QuoteViewerSelectors.selectCanShowNext);
  readonly canShowPrevious$: Observable<boolean> = this.store.select(QuoteViewerSelectors.selectCanShowPrevious);
  readonly canPlaySlideshow$: Observable<boolean> = this.store.select(QuoteViewerSelectors.selectCanPlaySlideshow);
  readonly canPauseSlideshow$: Observable<boolean> = this.store.select(QuoteViewerSelectors.selectCanPauseSlideshow);
  readonly canStopSlideshow$: Observable<boolean> = this.store.select(QuoteViewerSelectors.selectCanStopSlideshow);
  readonly canFilter$: Observable<boolean> = this.store.select(QuoteViewerSelectors.selectCanFilter);
  readonly canToggleBookmark$: Observable<boolean> = this.store.select(QuoteViewerSelectors.selectCanToggleBookmark);
  readonly filter$: Observable<Filter> = this.store.select(QuoteViewerSelectors.selectFilter);
  readonly isLoading$: Observable<boolean> = this.store.select(QuoteViewerSelectors.selectIsLoading);

  showNext(): void {
    this.store.dispatch(QuoteViewerActions.showNext());
  }

  showPrevious(): void {
    this.store.dispatch(QuoteViewerActions.showPrevious());
  }

  toggleBookmark(): void {
    this.store.dispatch(QuoteViewerActions.toggleBookmark());
  }

  toggleFilter(): void {
    this.store.dispatch(QuoteViewerActions.toggleFilter());
  }

  stopSlideshow(): void {
    this.store.dispatch(QuoteViewerActions.stopSlideshow());
  }

  toggleSlideshowPlayback(): void {
    this.store.dispatch(QuoteViewerActions.toggleSlideshowPlayback());
  }

  init(): void {
    this.store.dispatch(QuoteViewerActions.init());
  }
}
