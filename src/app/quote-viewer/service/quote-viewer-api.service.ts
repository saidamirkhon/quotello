import { HttpClient } from '@angular/common/http';
import {
  inject,
  Injectable,
} from '@angular/core';
import { Quote } from '@app-quote-viewer/model';
import { Observable } from 'rxjs';

@Injectable()
export class QuoteViewerApiService {
  private readonly http: HttpClient = inject(HttpClient);

  fetchQuote(): Observable<Quote> {
    return this.http.get<Quote>('https://api.quotable.io/random');
  }
}
