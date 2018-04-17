import { load } from './load';
import { ValueType } from './schema';

describe('load function', () => {
  let options;
  let env;

  beforeEach(() => {
    env = {};
    options = { env: () => env };
  });

  it('should read configuration from a single value schema', () => {
    const schema = {
      logLevel: {
        env: 'LOG_LEVEL'
      }
    };
    env.LOG_LEVEL = 'info';

    const configuration = load(schema, options);

    expect(configuration).toEqual({ logLevel: 'info' });
  });

  it('should read configuration from a nested schema', () => {
    const schema = {
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

    const configuration = load(schema, options);

    expect(configuration).toEqual({
      log: {
        level: 'info',
        file: '/tmp/log.txt'
      }
    });
  });

  it('wont set a value for a missing variable', () => {
    const schema = {
      logLevel: {
        env: 'LOG_LEVEL'
      }
    };

    const configuration = load(schema, options);

    expect(configuration).toEqual({});
  });

  it('should set a default value for a missing variable', () => {
    const schema = {
      logLevel: {
        env: 'LOG_LEVEL',
        default: 'info'
      }
    };

    const configuration = load(schema, options);

    expect(configuration).toEqual({ logLevel: 'info' });
  });

  it('should fail if a required variable is missing', () => {
    const schema = {
      logLevel: {
        env: 'LOG_LEVEL',
        required: true
      }
    };

    const loadCall = () => load(schema, options);

    expect(loadCall).toThrow('LOG_LEVEL variable is required but missing');
  });

  it('should convert variable to given type', () => {
    const schema = {
      withLog: {
        env: 'WITH_LOG',
        type: 'boolean' as ValueType
      }
    };
    env.WITH_LOG = 'true';

    const configuration = load(schema, options);

    expect(configuration.withLog).toBeTruthy();
  });

  it('should convert variable using custom converter', () => {
    const schema = {
      withLog: {
        env: 'WITH_LOG',
        convert: v => `${v} is converted`
      }
    };
    env.WITH_LOG = 'value';

    const configuration = load(schema, options);

    expect(configuration.withLog).toEqual('value is converted');
  });

  describe('when fallback variables are provided for a key', () => {
    it('should set value from another variable when first one is missing', () => {
      const schema = {
        port: {
          env: ['PORT', 'API_PORT']
        }
      };
      env.API_PORT = '8080';

      const configuration = load(schema, options);

      expect(configuration).toEqual({ port: '8080' });
    });

    it('should set value from first variable when present', () => {
      const schema = {
        port: {
          env: ['PORT', 'API_PORT']
        }
      };
      env.PORT = '8080';

      const configuration = load(schema, options);

      expect(configuration).toEqual({ port: '8080' });
    });

    it('should fail if all variables are missing though key is required', () => {
      const schema = {
        logLevel: {
          env: ['PORT', 'API_PORT'],
          required: true
        }
      };

      const loadCall = () => load(schema, options);

      expect(loadCall).toThrow(
        'At least one variable should be defined in: PORT, API_PORT'
      );
    });
  });
});
