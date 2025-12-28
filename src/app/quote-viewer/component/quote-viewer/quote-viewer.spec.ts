import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { QuoteViewer } from '@app-quote-viewer/component/quote-viewer/quote-viewer';
import { describe } from 'vitest';

describe(
  'QuoteViewer',
  () => {
    let quoteViewer: QuoteViewer;
    let fixture: ComponentFixture<QuoteViewer>;
    beforeEach(
      () => {
        TestBed
          .configureTestingModule(
            {
              imports: [QuoteViewer],
            },
          )
          .overrideComponent(
            QuoteViewer,
            {
              set: {
                template: '',
              },
            },
          );
        fixture = TestBed.createComponent(QuoteViewer);
        quoteViewer = fixture.componentInstance;
      },
    );
    it(
      'should emit toggleSlideshowPlayback event when space key is released',
      () => {
        const toggleSlideshowPlaybackSpy = vi.spyOn(
          quoteViewer.toggleSlideshowPlayback,
          'emit',
        );
        const spaceKeyUpEvent = new KeyboardEvent(
          'keyup',
          {
            code: 'Space',
          },
        );
        window.dispatchEvent(spaceKeyUpEvent);
        expect(toggleSlideshowPlaybackSpy)
          .toHaveBeenCalled();
      },
    );
    it(
      'should not emit toggleSlideshowPlayback event when key other than space is released',
      () => {
        const toggleSlideshowPlaybackSpy = vi.spyOn(
          quoteViewer.toggleSlideshowPlayback,
          'emit',
        );
        const spaceKeyUpEvent = new KeyboardEvent(
          'keyup',
          {
            code: 'Enter',
          },
        );
        window.dispatchEvent(spaceKeyUpEvent);
        expect(toggleSlideshowPlaybackSpy)
          .not
          .toHaveBeenCalled();
      },
    );
  },
);
