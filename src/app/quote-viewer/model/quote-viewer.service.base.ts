import { DisplayMode } from '@app-quote-viewer/model/display-mode';
import { Filter } from '@app-quote-viewer/model/filter';
import { Quote } from '@app-quote-viewer/model/quote';
import { SlideshowPlaybackState } from '@app-quote-viewer/model/slideshow-playback-state';
import { Observable } from 'rxjs';

export abstract class QuoteViewerServiceBase {
  abstract readonly quote$: Observable<Quote | null>;
  abstract readonly slideProgress$: Observable<number>;
  abstract readonly canShowNext$: Observable<boolean>;
  abstract readonly canShowPrevious$: Observable<boolean>;
  abstract readonly canPlaySlideshow$: Observable<boolean>;
  abstract readonly canPauseSlideshow$: Observable<boolean>;
  abstract readonly canStopSlideshow$: Observable<boolean>;
  abstract readonly canFilter$: Observable<boolean>;
  abstract readonly canToggleBookmark$: Observable<boolean>;
  abstract readonly filter$: Observable<Filter>;
  abstract readonly isLoading$: Observable<boolean>;
  abstract readonly activeIndex$: Observable<number>;
  abstract readonly filteredQuoteList$: Observable<Quote[]>;
  abstract readonly bookmarkedQuoteList$: Observable<Quote[]>;
  abstract readonly quoteList$: Observable<Quote[]>;
  abstract readonly displayMode$: Observable<DisplayMode>;
  abstract readonly slideshowPlaybackState$: Observable<SlideshowPlaybackState>;
  abstract readonly slideStep$: Observable<number>;

  abstract showNext(): void;

  abstract showPrevious(): void;

  abstract toggleBookmark(): void;

  abstract toggleFilter(): void;

  abstract stopSlideshow(): void;

  abstract toggleSlideshowPlayback(): void;

  abstract init(): void;

  protected constructor() {
  }
}
