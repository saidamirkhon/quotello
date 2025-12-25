import { HttpClient } from '@angular/common/http';
import {
  inject,
  Injectable,
} from '@angular/core';
import {
  Quote,
  QuoteDto,
} from '@app-quote-viewer/model';
import { toQuote } from '@app-quote-viewer/util';
import {
  map,
  Observable,
} from 'rxjs';

@Injectable()
export class QuoteViewerApiService {
  private readonly http: HttpClient = inject(HttpClient);

  fetchQuote(): Observable<Quote> {
    return this.http.get<QuoteDto>('https://api.quotable.io/random')
      .pipe(map(toQuote));
  }
}
