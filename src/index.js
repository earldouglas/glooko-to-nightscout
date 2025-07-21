const env = require('./env.js');
const glookoClient = require('glookoClient');
const nightscout = require('./nightscout.js');

const glookoEmail = env.envVarReq('GLOOKO_EMAIL');
const glookoPassword = env.envVarReq('GLOOKO_PASSWORD');

const nightscoutHost = env.envVarReq('NIGHTSCOUT_HOST');
const nightscoutApiSecret = env.envVarReq('NIGHTSCOUT_API_SECRET');

async function main() {

  const glookoCookie =
    await glookoClient
    .getGlookoCookie(
      glookoEmail,
      glookoPassword
    );

  const glookoCode =
    await glookoClient
    .getGlookoCode(
      glookoCookie
    );

  const boluses =
    await glookoClient
    .getBoluses(
      glookoCookie,
      glookoCode
    );

  const done =
    await nightscout.addTreatments(
      nightscoutHost,
      nightscoutApiSecret,
      boluses
    );

  return done;
};

main()
  .then((done) => {
    if (done) {
      console.log('Done!');
    } else {
      console.error('Something went wrong!');
    }
  });