import { DescriptionType } from './description';
import { load } from './load';

describe('load function', () => {
  let options;
  let env;

  beforeEach(() => {
    env = {};
    options = { env: () => env };
  });

  it('should read configuration from a single variable description', () => {
    const description = {
      logLevel: {
        env: 'LOG_LEVEL'
      }
    };
    env.LOG_LEVEL = 'info';

    const configuration = load(description, options);

    expect(configuration).toEqual({ logLevel: 'info' });
  });

  it('should read configuration from a nested description', () => {
    const description = {
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

    const configuration = load(description, options);

    expect(configuration).toEqual({
      log: {
        level: 'info',
        file: '/tmp/log.txt'
      }
    });
  });

  it('wont set a value for a missing variable', () => {
    const description = {
      logLevel: {
        env: 'LOG_LEVEL'
      }
    };

    const configuration = load(description, options);

    expect(configuration).toEqual({});
  });

  it('should set a default value for a missing variable', () => {
    const description = {
      logLevel: {
        env: 'LOG_LEVEL',
        default: 'info'
      }
    };

    const configuration = load(description, options);

    expect(configuration).toEqual({ logLevel: 'info' });
  });

  it('should fail if a required variable is missing', () => {
    const description = {
      logLevel: {
        env: 'LOG_LEVEL',
        required: true
      }
    };

    const loadCall = () => load(description, options);

    expect(loadCall).toThrow('LOG_LEVEL variable is required but missing');
  });

  it('should convert variable to given type', () => {
    const description = {
      withLog: {
        env: 'WITH_LOG',
        type: 'boolean' as DescriptionType
      }
    };
    env.WITH_LOG = 'true';

    const configuration = load(description, options);

    expect(configuration.withLog).toBeTruthy();
  });

  it('should convert variable using custom converter', () => {
    const description = {
      withLog: {
        env: 'WITH_LOG',
        convert: v => `${v} is converted`
      }
    };
    env.WITH_LOG = 'value';

    const configuration = load(description, options);

    expect(configuration.withLog).toEqual('value is converted');
  });
});
