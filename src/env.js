const doWith = (x) => (k) => k(x);

const fail = (message) => {
  throw new Error(message);
};

const envVarOpt = (name) =>
  doWith((process.env[name] || '').trim())((value) =>
    value.length === 0 ? null : value
  );

const envVarReq = (name) =>
  doWith(envVarOpt(name))(value =>
    value ? value : fail(`${name} is required`)
  );

module.exports = {
  envVarOpt: envVarOpt,
  envVarReq: envVarReq,
};