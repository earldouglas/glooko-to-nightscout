async function addTreatments(nightscoutHost, nightscoutApiSecret, treatments) {

  const response =
    await fetch(`https://${nightscoutHost}/api/v1/treatments`, {
      method: 'POST',
      headers: {
        'api-secret': nightscoutApiSecret,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(treatments),
    });

  return response.status === 200;
}

module.exports = {
  addTreatments: addTreatments,
};