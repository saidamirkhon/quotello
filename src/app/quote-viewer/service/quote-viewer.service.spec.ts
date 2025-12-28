import { TestBed } from '@angular/core/testing';
import { QuoteViewerService } from '@app-quote-viewer/service/quote-viewer.service';
import { QuoteViewerActions } from '@app-quote-viewer/state/quote-viewer.actions';
import { Store } from '@ngrx/store';
import {
  MockStore,
  provideMockStore,
} from '@ngrx/store/testing';
import {
  describe,
  expect,
  MockInstance,
} from 'vitest';

describe(
  'QuoteViewerService',
  () => {
    let quoteViewerService: QuoteViewerService;
    let store: Store;
    let dispatchSpy: MockInstance;
    beforeEach(
      () => {
        TestBed
          .configureTestingModule(
            {
              providers: [
                QuoteViewerService,
                provideMockStore(),
              ],
            },
          );
        quoteViewerService = TestBed.inject(QuoteViewerService);
        store = TestBed.inject(MockStore);
        dispatchSpy = vi.spyOn(
          store,
          'dispatch',
        );
      },
    );
    it(
      'should dispatch showNext action',
      () => {
        quoteViewerService.showNext();
        expect(dispatchSpy)
          .toHaveBeenCalledWith(QuoteViewerActions.showNext());
      },
    );
    it(
      'should dispatch showPrevious action',
      () => {
        quoteViewerService.showPrevious();
        expect(dispatchSpy)
          .toHaveBeenCalledWith(QuoteViewerActions.showPrevious());
      },
    );
    it(
      'should dispatch toggleBookmark action',
      () => {
        quoteViewerService.toggleBookmark();
        expect(dispatchSpy)
          .toHaveBeenCalledWith(QuoteViewerActions.toggleBookmark());
      },
    );
    it(
      'should dispatch toggleFilter action',
      () => {
        quoteViewerService.toggleFilter();
        expect(dispatchSpy)
          .toHaveBeenCalledWith(QuoteViewerActions.toggleFilter());
      },
    );
    it(
      'should dispatch stopSlideshow action',
      () => {
        quoteViewerService.stopSlideshow();
        expect(dispatchSpy)
          .toHaveBeenCalledWith(QuoteViewerActions.stopSlideshow());
      },
    );
    it(
      'should dispatch toggleSlideshowPlayback action',
      () => {
        quoteViewerService.toggleSlideshowPlayback();
        expect(dispatchSpy)
          .toHaveBeenCalledWith(QuoteViewerActions.toggleSlideshowPlayback());
      },
    );
    it(
      'should dispatch init action',
      () => {
        quoteViewerService.init();
        expect(dispatchSpy)
          .toHaveBeenCalledWith(QuoteViewerActions.init());
      },
    );
  },
);
