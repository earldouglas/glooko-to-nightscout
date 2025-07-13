const env = require('../src/env.js');
const assert = require('assert');

describe('env', () => {

  describe('envVarOpt', () => {

    describe('FOO', () => {
      it('should return null', () => {

        const expected = null
        const obtained = env.envVarOpt('FOO');

        assert.equal(expected, obtained);
      });
    });

    describe('HOME', () => {
      it('should return a value', () => {

        const expected = '/home/';
        const obtained = env.envVarOpt('HOME').substring(0, 6);

        assert.equal(expected, obtained);
      });
    });
  });

  describe('envVarReq', () => {

    describe('FOO', () => {
      it('should throw an error', () => {
        assert.throws(() => env.envVarReq('FOO'));
      });
    });

    describe('HOME', () => {
      it('should return a value', () => {

        const expected = '/home/';
        const obtained = env.envVarReq('HOME').substring(0, 6);

        assert.equal(expected, obtained);
      });
    });
  });
});