'use strict';

const convert = require('./convert');

describe('convert function', () => {

  it('won\'t do anything for a string', () => {
    convert('hello', {type: 'string'}).should.equal('hello');
  });

  it('should convert to string by default', () => {
    convert('hello', {}).should.equal('hello');
  });

  it('should fail if type is unknown', () => {
    let convertCall = () => convert('hello', {type: 'over9000'});

    convertCall.should.throw(Error, 'over9000 is an invalid type');
  });

  it('should convert to boolean with multiple representations', () => {
    convert('true', {type: 'boolean'}).should.equal(true);
    convert('TRUE', {type: 'boolean'}).should.equal(true);
    convert('yes', {type: 'boolean'}).should.equal(true);
    convert('false', {type: 'boolean'}).should.equal(false);
    convert('no', {type: 'boolean'}).should.equal(false);
  });

  it('should fail if boolean representation is invalid', () => {
    let convertCall = () => convert('tru', {type: 'boolean'});

    convertCall.should.throw(Error, 'tru is not a valid boolean');
  });

  it('should convert to integer', () => {
    convert('1337', {type: 'integer'}).should.equal(1337);
  });

  it('should fail if integer representation is invalid', () => {
    let convertCall = () => convert('hello42', {type: 'integer'});

    convertCall.should.throw(Error, 'hello42 is not a valid integer');
  });

  it('should convert to float', () => {
    convert('13.37', {type: 'float'}).should.equal(13.37);
  });

  it('should fail if float representation is invalid', () => {
    let convertCall = () => convert('hello4.2', {type: 'float'});

    convertCall.should.throw(Error, 'hello4.2 is not a valid float');
  });
});
