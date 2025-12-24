import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';
import { Quote } from '@app-quote-viewer/model';

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
  readonly showOnlyBookmarked = input.required<boolean | null>();
  readonly canShowNext = input.required<boolean | null>();
  readonly canShowPrevious = input.required<boolean | null>();
  readonly canPlaySlideshow = input.required<boolean | null>();
  readonly canPauseSlideshow = input.required<boolean | null>();
  readonly canShowOnlyBookmarked = input.required<boolean | null>();
  readonly showNext = output<void>();
  readonly showPrevious = output<void>();
  readonly pauseSlideshow = output<void>();
  readonly playSlideshow = output<void>();
  readonly toggleBookmark = output<void>();
  readonly toggleSlideshowPlayback = output<void>();
  readonly toggleShowOnlyBookmarked = output<void>();

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
