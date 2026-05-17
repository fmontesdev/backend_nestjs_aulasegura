import { parseFiltersString } from './filters-parser.util';
import { TagType } from '../../domain/enums/tag-type.enum';

describe('tags filters parser', () => {
  it('parses global text and typed filters', () => {
    expect(parseFiltersString('ana,type:rfid,user:Ruiz,email:ana@example.com,active:false')).toEqual({
      globalSearch: ['ana'],
      type: TagType.RFID,
      user: 'Ruiz',
      email: 'ana@example.com',
      isActive: false,
    });
  });

  it('parses Spanish aliases', () => {
    expect(parseFiltersString('tipo:nfc_mobile,usuario:Juan,estado:activo')).toEqual({
      type: TagType.NFC_MOBILE,
      user: 'Juan',
      isActive: true,
    });
  });

  it('ignores technical tagCode filter aliases', () => {
    expect(parseFiltersString('code:ABC,tag:XYZ,tagCode:SECRET')).toEqual({});
  });
});
