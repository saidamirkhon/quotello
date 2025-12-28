import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { QuoteViewerPage } from '@app-quote-viewer/component/quote-viewer-page/quote-viewer-page';
import { QuoteViewerService } from '@app-quote-viewer/service/quote-viewer.service';
import { QuoteViewerServiceMock } from '@app-quote-viewer/service/quote-viewer.service.mock';
import {
  describe,
  expect,
} from 'vitest';

describe(
  'QuoteViewer',
  () => {
    let quoteViewerPage: QuoteViewerPage;
    let quoteViewerService: QuoteViewerService;
    let fixture: ComponentFixture<QuoteViewerPage>;
    beforeEach(
      () => {
        TestBed
          .configureTestingModule(
            {
              imports: [QuoteViewerPage],
              providers: [
                {
                  provide: QuoteViewerService,
                  useClass: QuoteViewerServiceMock,
                },
              ],
            },
          )
          .overrideComponent(
            QuoteViewerPage,
            {
              set: {
                template: '',
              },
            },
          );
        fixture = TestBed.createComponent(QuoteViewerPage);
        quoteViewerPage = fixture.componentInstance;
        quoteViewerService = TestBed.inject(QuoteViewerService);
      },
    );
    it(
      'should call QuoteViewerService.init() in ngOnInit()',
      () => {
        const quoteViewerServiceInitSpy = vi.spyOn(
          quoteViewerService,
          'init',
        );
        quoteViewerPage.ngOnInit();
        expect(quoteViewerServiceInitSpy)
          .toHaveBeenCalled();
      },
    );
  },
);
