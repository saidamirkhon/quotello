import {
  Quote,
  QuoteFromDummyJsonDto,
  QuoteFromQuotableDto,
  QuoteFromQuoteSlateDto,
} from '@app-quote-viewer/model';

export class QuoteMapper {
  static readonly fromQuotable = (quoteDto: QuoteFromQuotableDto): Quote => {
    return {
      author: quoteDto.author,
      text: quoteDto.content,
      id: quoteDto._id,
      isBookmarked: false,
    };
  };

  static readonly fromDummyJson = (quoteDto: QuoteFromDummyJsonDto): Quote => {
    return {
      author: quoteDto.author,
      text: quoteDto.quote,
      id: `${quoteDto.id}`,
      isBookmarked: false,
    };
  };

  static readonly fromQuoteSlate = (quoteDto: QuoteFromQuoteSlateDto): Quote => {
    return {
      author: quoteDto.author,
      text: quoteDto.quote,
      id: `${quoteDto.id}`,
      isBookmarked: false,
    };
  };

  private constructor() {
  }
}
