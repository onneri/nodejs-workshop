/** environment configuraton file */
// environments
const environments = {
  //default
  development: {
    PORT: 3000,
    ENV_NAME: 'development'
  },
  //staging
  staging: {
    PORT: 4000,
    ENV_NAME: 'staging'
  }
};

// determine which env to export
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : "";

//
const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.development;

module.exports = environmentToExport;
