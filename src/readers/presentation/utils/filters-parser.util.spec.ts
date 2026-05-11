import { parseFiltersString } from './filters-parser.util';

describe('readers filters parser', () => {
  it('parses global search and room filter', () => {
    expect(parseFiltersString('reader-01,room:A101')).toEqual({
      globalSearch: ['reader-01'],
      room: 'A101',
    });
  });

  it('parses active false filter', () => {
    expect(parseFiltersString('active:false')).toEqual({
      isActive: false,
    });
  });

  it('parses code aliases for reader code search', () => {
    expect(parseFiltersString('code:reader-01')).toEqual({
      code: 'reader-01',
    });
    expect(parseFiltersString('codigo:reader-02')).toEqual({
      code: 'reader-02',
    });
  });
});
