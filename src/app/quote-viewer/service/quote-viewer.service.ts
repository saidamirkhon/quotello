import {
  inject,
  Injectable,
} from '@angular/core';
import { Quote } from '@app-quote-viewer/model';
import { QuoteViewerActions } from '@app-quote-viewer/store/actions';
import { QuoteViewerSelectors } from '@app-quote-viewer/store/selectors';
import { Store } from '@ngrx/store';
import {
  Observable,
  of,
} from 'rxjs';

@Injectable()
export class QuoteViewerService {
  private readonly store = inject(Store);
  readonly quote$: Observable<Quote> = of(
    {
      id: 1,
      author: '',
      text: '',
      isBookmarked: false,
    },
  );
  readonly slideshowProgress$: Observable<number> = this.store.select(QuoteViewerSelectors.selectSlideshowProgress);
  readonly canShowNext$: Observable<boolean> = of(true);
  readonly canShowPrevious$: Observable<boolean> = of(true);
  readonly canPlaySlideshow$: Observable<boolean> = of(true);
  readonly canPauseSlideshow$: Observable<boolean> = of(true);
  readonly canShowOnlyBookmarked$: Observable<boolean> = of(true);
  readonly showOnlyBookmarked$: Observable<boolean> = this.store.select(QuoteViewerSelectors.selectShowOnlyBookmarked);

  showNext(): void {

  }

  showPrevious(): void {

  }

  pauseSlideshow(): void {

  }

  playSlideshow(): void {

  }

  toggleBookmark(): void {

  }

  toggleShowOnlyBookmarked(): void {

  }

  toggleSlideshowPlayback(): void {

  }

  init(): void {
    this.store.dispatch(QuoteViewerActions.init());
  }
}
