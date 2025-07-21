function localDate(timestampISOString, offsetString) {

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
}

async function getBoluses(glookoCookie, glookoCode) {

  const twoDaysAgo = new Date().getTime() - (2 * 24 * 60 * 60 * 1000);
  const limit = Math.ceil(((new Date()).getTime() - twoDaysAgo) / (1000 * 60 * 5));

  const startDate = (new Date(twoDaysAgo)).toISOString();
  const lastGuid = '2a2fd078-2a20-4106-ba0f-8ec144f6a89b';

  const response =
    await fetch(`https://api.glooko.com/api/v2/pumps/normal_boluses?patient=${glookoCode}&startDate=${startDate}&lastUpdatedAt=${startDate}&lastGuid=${lastGuid}&limit=${limit}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json; charset=UTF-8',
        Cookie: glookoCookie,
      },
    });

  const responseBody = await response.json();

  return responseBody.normalBoluses.map((x) => {

    const timestamp =
      localDate(x.pumpTimestamp, x.pumpTimestampUtcOffset)
      .toISOString();

    return {
      eventType: 'Bolus',
      insulin: x.insulinDelivered,
      'created_at': timestamp,
    };
  });
}

module.exports = {
  getBoluses: getBoluses,
};