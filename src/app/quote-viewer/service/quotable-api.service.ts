import { HttpClient } from '@angular/common/http';
import {
  inject,
  Injectable,
} from '@angular/core';
import {
  Quote,
  QuoteApiService,
  QuoteFromQuotableDto,
} from '@app-quote-viewer/model';
import { QuoteMapper } from '@app-quote-viewer/util';
import {
  map,
  Observable,
} from 'rxjs';

@Injectable()
export class QuotableApiService
  implements QuoteApiService {
  private readonly http: HttpClient = inject(HttpClient);

  fetchQuote(): Observable<Quote> {
    return this.http.get<QuoteFromQuotableDto>('https://api.quotable.io/random')
      .pipe(map(QuoteMapper.fromQuotable));
  }
}
