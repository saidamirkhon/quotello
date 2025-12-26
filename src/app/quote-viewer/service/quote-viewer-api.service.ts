import { HttpClient } from '@angular/common/http';
import {
  inject,
  Injectable,
} from '@angular/core';
import {
  QuoteFromDummyJsonDto,
  QuoteFromQuotableDto,
  QuoteFromQuoteSlateDto,
} from '@app-quote-viewer/model';
import { Observable } from 'rxjs';

@Injectable()
export class QuoteViewerApiService {
  private readonly http: HttpClient = inject(HttpClient);

  fetchQuoteFromQuotable(): Observable<QuoteFromQuotableDto> {
    return this.http.get<QuoteFromQuotableDto>('https://api.quotable.io/random');
  }

  fetchQuoteFromDummyJson(): Observable<QuoteFromDummyJsonDto> {
    return this.http.get<QuoteFromDummyJsonDto>('https://dummyjson.com/quotes/random');
  }

  fetchQuoteFromQuoteSlate(): Observable<QuoteFromQuoteSlateDto> {
    return this.http.get<QuoteFromDummyJsonDto>('https://quoteslate.vercel.app/api/quotes/random');
  }
}
