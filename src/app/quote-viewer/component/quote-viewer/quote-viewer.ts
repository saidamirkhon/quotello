import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';
import {
  Filter,
  Quote,
} from '@app-quote-viewer/model';

@Component(
  {
    selector: 'app-quote-viewer',
    templateUrl: './quote-viewer.html',
    styleUrl: './quote-viewer.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
  },
)
export class QuoteViewer {
  readonly quote = input.required<Quote | null>();
  readonly slideshowProgress = input.required<number | null>();
  readonly canShowNext = input.required<boolean | null>();
  readonly canShowPrevious = input.required<boolean | null>();
  readonly canPlaySlideshow = input.required<boolean | null>();
  readonly canPauseSlideshow = input.required<boolean | null>();
  readonly canStopSlideshow = input.required<boolean | null>();
  readonly canFilter = input.required<boolean | null>();
  readonly filter = input.required<Filter | null>();
  readonly showNext = output<void>();
  readonly showPrevious = output<void>();
  readonly toggleBookmark = output<void>();
  readonly toggleSlideshowPlayback = output<void>();
  readonly toggleFilter = output<void>();
  readonly stopSlideshow = output<void>();
  readonly Filter = Filter;

  @HostListener(
    'window:keyup',
    ['$event'],
  )
  keyReleased(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.toggleSlideshowPlayback.emit();
    }
  }
}
