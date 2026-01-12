import { HttpClient } from '@angular/common/http';
import {
  inject,
  Injectable,
} from '@angular/core';
import {
  Quote,
  QuoteApiService,
  QuoteFromDummyJsonDto,
} from '@app-quote-viewer/model';
import { QuoteMapper } from '@app-quote-viewer/util';
import {
  map,
  Observable,
} from 'rxjs';

@Injectable()
export class QuoteSlateApiService
  implements QuoteApiService {
  private readonly http: HttpClient = inject(HttpClient);

  fetchQuote(): Observable<Quote> {
    return this.http.get<QuoteFromDummyJsonDto>('https://quoteslate.vercel.app/api/quotes/random')
      .pipe(map(QuoteMapper.fromQuoteSlate));
  }
}
