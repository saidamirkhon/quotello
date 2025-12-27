import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Icon } from '@app-model';
import {
  DisplayMode,
  Filter,
  Quote,
} from '@app-quote-viewer/model';

@Component(
  {
    selector: 'app-quote-viewer',
    templateUrl: './quote-viewer.html',
    styleUrl: './quote-viewer.scss',
    imports: [
      MatCardModule,
      MatButtonModule,
      MatCheckboxModule,
      MatIconModule,
      MatTooltipModule,
      MatProgressBarModule,
      MatDividerModule,
      MatButtonToggleModule,
    ],
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
  readonly canToggleBookmark = input.required<boolean | null>();
  readonly filter = input.required<Filter | null>();
  readonly isLoading = input.required<boolean | null>();
  readonly displayMode = input.required<DisplayMode | null>();
  readonly showNext = output<void>();
  readonly showPrevious = output<void>();
  readonly toggleBookmark = output<void>();
  readonly toggleSlideshowPlayback = output<void>();
  readonly toggleFilter = output<void>();
  readonly stopSlideshow = output<void>();
  readonly Filter = Filter;
  readonly Icon = Icon;
  readonly DisplayMode = DisplayMode;

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
