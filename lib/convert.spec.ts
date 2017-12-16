import { convert } from './convert';
import { ValueType } from './schema';

describe('convert function', () => {
  it('wont do anything for a string', () => {
    expect(convert('hello', 'string')).toEqual('hello');
  });

  it('should convert to string by default', () => {
    expect(convert('hello')).toEqual('hello');
  });

  it('should fail if type is unknown', () => {
    const convertCall = () => convert('hello', 'over9000' as ValueType);

    expect(convertCall).toThrow('over9000 is an invalid type');
  });

  it('should convert to boolean with multiple representations', () => {
    expect(convert('true', 'boolean')).toEqual(true);
    expect(convert('TRUE', 'boolean')).toEqual(true);
    expect(convert('yes', 'boolean')).toEqual(true);
    expect(convert('false', 'boolean')).toEqual(false);
    expect(convert('no', 'boolean')).toEqual(false);
  });

  it('should fail if boolean representation is invalid', () => {
    const convertCall = () => convert('tru', 'boolean');

    expect(convertCall).toThrow('tru is not a valid boolean');
  });

  it('should convert to integer', () => {
    expect(convert('1337', 'integer')).toEqual(1337);
  });

  it('should fail if integer representation is invalid', () => {
    const convertCall = () => convert('hello42', 'integer');

    expect(convertCall).toThrow('hello42 is not a valid integer');
  });

  it('should convert to float', () => {
    expect(convert('13.37', 'float')).toEqual(13.37);
  });

  it('should fail if float representation is invalid', () => {
    const convertCall = () => convert('hello4.2', 'float');

    expect(convertCall).toThrow('hello4.2 is not a valid float');
  });
});
