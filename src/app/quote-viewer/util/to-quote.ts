import {
  Quote,
  QuoteDto,
} from '@app-quote-viewer/model';

export function toQuote(quoteDto: QuoteDto): Quote {
  return {
    isBookmarked: false,
    author: quoteDto.author,
    text: quoteDto.content,
    id: quoteDto._id,
  };
}
