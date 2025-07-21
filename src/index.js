const env = require('./env.js');
const glookoClient = require('glookoClient');
const nightscoutClient = require('nightscoutClient');

const glookoEmail = env.envVarReq('GLOOKO_EMAIL');
const glookoPassword = env.envVarReq('GLOOKO_PASSWORD');

const nightscoutHost = env.envVarReq('NIGHTSCOUT_HOST');
const nightscoutApiSecret = env.envVarReq('NIGHTSCOUT_API_SECRET');

async function main() {

  const glookoCookie =
    await
      glookoClient
        .getGlookoCookie(
          glookoEmail,
          glookoPassword
        );

  const glookoCode =
    await
      glookoClient
        .getGlookoCode(
          glookoCookie
        );

  const boluses =
    await
      glookoClient
        .getBoluses(
          glookoCookie,
          glookoCode
        ).then((boluses) =>
          boluses
            .normalBoluses
            .map((x) => {

              const localDate = (timestampISOString, offsetString) => {

                const offsetRegex = /^([+-])(\d\d):(\d\d)$/;

                // HACK: fix the incorrect time zone provided by Glooko
                const offsetGroups =
                  offsetString === "+00:00" ?
                  "-07:00".match(offsetRegex) :
                  offsetString.match(offsetRegex);

                const offsetSign = offsetGroups[1] === '+' ? -1 : 1;
                const offsetHours = Number(`${offsetGroups[2]}`)
                const offsetMins = Number(`${offsetGroups[3]}`)

                const totalOffsetInMillis =
                  offsetSign * (offsetHours * 60 + offsetMins) * 60 * 1000;

                const offsetDate = new Date(timestampISOString);
                offsetDate.setTime(offsetDate.getTime() + totalOffsetInMillis);

                return offsetDate;
              };

              const timestamp =
                localDate(x.pumpTimestamp, x.pumpTimestampUtcOffset)
                .toISOString();

              return {
                eventType: 'Bolus',
                insulin: x.insulinDelivered,
                'created_at': timestamp,
              };
            })
        );

  const done =
    await
      nightscoutClient
        .addTreatments(
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
