import { parseFiltersString } from './filters-parser.util';

describe('rooms filters parser', () => {
  it('parses global search and numeric room filters', () => {
    expect(parseFiltersString('lab,building:1,floor:0')).toEqual({
      globalSearch: ['lab'],
      building: 1,
      floor: 0,
    });
  });

  it('parses course filter by value', () => {
    expect(parseFiltersString('course:ESO')).toEqual({
      course: 'ESO',
    });
  });

  it('parses name aliases for combined room code and name search', () => {
    expect(parseFiltersString('name:lab')).toEqual({
      name: 'lab',
    });
    expect(parseFiltersString('nombre:A101')).toEqual({
      name: 'A101',
    });
  });
});
