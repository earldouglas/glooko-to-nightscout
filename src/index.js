const env = require('./env.js');
const glooko = require('./glooko.js');
const nightscout = require('./nightscout.js');

const glookoEmail = env.envVarReq('GLOOKO_EMAIL');
const glookoPassword = env.envVarReq('GLOOKO_PASSWORD');

const nightscoutHost = env.envVarReq('NIGHTSCOUT_HOST');
const nightscoutApiSecret = env.envVarReq('NIGHTSCOUT_API_SECRET');

async function main() {

  const glookoCookie =
    await glooko.getGlookoCookie(
      glookoEmail,
      glookoPassword
    );

  const glookoCode =
    await glooko.getGlookoCode(
      glookoCookie
    );

  const boluses =
    await glooko.getBoluses(
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