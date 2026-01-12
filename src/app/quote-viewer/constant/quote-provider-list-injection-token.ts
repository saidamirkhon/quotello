import { InjectionToken } from '@angular/core';
import { QuoteApiService } from '@app-quote-viewer/model';

export const QUOTE_PROVIDER_LIST_INJECTION_TOKEN = new InjectionToken<QuoteApiService[]>('Quote provider list');
