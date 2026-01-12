import { Quote } from '@app-quote-viewer/model/quote';
import { Observable } from 'rxjs';

export interface QuoteApiService {
  fetchQuote(): Observable<Quote>;
}
