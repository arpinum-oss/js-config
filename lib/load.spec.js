'use strict';

const load = require('./load');

describe('load function', () => {
  let options;
  let env;

  beforeEach(() => {
    env = {};
    options = { env: () => env };
  });

  it('should read configuration from a single variable description', () => {
    let description = {
      logLevel: {
        env: 'LOG_LEVEL'
      }
    };
    env.LOG_LEVEL = 'info';

    let configuration = load(description, options);

    configuration.should.deep.equal({ logLevel: 'info' });
  });

  it('should read configuration from a nested description', () => {
    let description = {
      log: {
        level: {
          env: 'LOG_LEVEL'
        },
        file: {
          env: 'LOG_FILE'
        }
      }
    };
    env.LOG_LEVEL = 'info';
    env.LOG_FILE = '/tmp/log.txt';

    let configuration = load(description, options);

    configuration.should.deep.equal({
      log: {
        level: 'info',
        file: '/tmp/log.txt'
      }
    });
  });

  it('wont set a value for a missing variable', () => {
    let description = {
      logLevel: {
        env: 'LOG_LEVEL'
      }
    };

    let configuration = load(description, options);

    configuration.should.deep.equal({});
  });

  it('should set a default value for a missing variable', () => {
    let description = {
      logLevel: {
        env: 'LOG_LEVEL',
        default: 'info'
      }
    };

    let configuration = load(description, options);

    configuration.should.deep.equal({ logLevel: 'info' });
  });

  it('should fail if a required variable is missing', () => {
    let description = {
      logLevel: {
        env: 'LOG_LEVEL',
        required: true
      }
    };

    let loadCall = () => load(description, options);

    loadCall.should.throw(Error, 'LOG_LEVEL variable is required but missing');
  });

  it('should convert variable to given type', () => {
    let description = {
      withLog: {
        env: 'WITH_LOG',
        type: 'boolean'
      }
    };
    env.WITH_LOG = 'true';

    let configuration = load(description, options);

    configuration.withLog.should.be.true;
  });

  it('should convert variable using custom converter', () => {
    let description = {
      withLog: {
        env: 'WITH_LOG',
        convert: v => `${v} is converted`
      }
    };
    env.WITH_LOG = 'value';

    let configuration = load(description, options);

    configuration.withLog.should.equal('value is converted');
  });
});
