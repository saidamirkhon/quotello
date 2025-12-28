import { Injectable } from '@angular/core';
import {
  DisplayMode,
  Filter,
  Quote,
  SlideshowPlaybackState,
} from '@app-quote-viewer/model';
import { QuoteViewerServiceBase } from '@app-quote-viewer/model/quote-viewer.service.base';
import {
  Observable,
  of,
} from 'rxjs';

@Injectable()
export class QuoteViewerServiceMock
  extends QuoteViewerServiceBase {
  readonly activeIndex$: Observable<number> = of(-1);
  readonly bookmarkedQuoteList$: Observable<Quote[]> = of([]);
  readonly canFilter$: Observable<boolean> = of(true);
  readonly canPauseSlideshow$: Observable<boolean> = of(true);
  readonly canPlaySlideshow$: Observable<boolean> = of(true);
  readonly canShowNext$: Observable<boolean> = of(true);
  readonly canShowPrevious$: Observable<boolean> = of(true);
  readonly canStopSlideshow$: Observable<boolean> = of(true);
  readonly canToggleBookmark$: Observable<boolean> = of(true);
  readonly displayMode$: Observable<DisplayMode> = of(DisplayMode.MANUAL);
  readonly filter$: Observable<Filter> = of(Filter.ALL);
  readonly filteredQuoteList$: Observable<Quote[]> = of([]);
  readonly isLoading$: Observable<boolean> = of(false);
  readonly quote$: Observable<Quote | null> = of(null);
  readonly quoteList$: Observable<Quote[]> = of([]);
  readonly slideProgress$: Observable<number> = of(0);
  readonly slideStep$: Observable<number> = of(0);
  readonly slideshowPlaybackState$: Observable<SlideshowPlaybackState> = of(SlideshowPlaybackState.PAUSED);

  init(): void {
  }

  showNext(): void {
  }

  showPrevious(): void {
  }

  stopSlideshow(): void {
  }

  toggleBookmark(): void {
  }

  toggleFilter(): void {
  }

  toggleSlideshowPlayback(): void {
  }
}
