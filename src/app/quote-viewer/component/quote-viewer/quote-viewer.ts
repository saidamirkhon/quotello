import {
  ChangeDetectionStrategy,
  Component,
  input,
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
  readonly quote = input.required<Quote>();
}
