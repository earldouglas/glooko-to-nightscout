const env = require('../src/env.js');
const glooko = require('../src/glooko.js');
const glookoClient = require('glookoClient');
const assert = require('assert');

var GLOOKO_COOKIE = null;
var GLOOKO_CODE = null;

describe('glooko', () => {

  describe('getBoluses', () => {
    describe('(glookoCookie, glookoCookie)', () => {
      it('should return a glookoCode', function() {

        if (process.env['TEST_GLOOKO_AUTHN'] === undefined) {
          console.log('TEST_GLOOKO_AUTHN is unset; skipping');
          this.skip();
        }

        const glookoEmail = process.env['GLOOKO_EMAIL'];
        const glookoPassword = process.env['GLOOKO_PASSWORD'];

        return glookoClient
          .getGlookoCookie(glookoEmail, glookoPassword)
          .then((glookoCookie) => {

            return glookoClient
              .getGlookoCode(glookoCookie)
              .then((glookoCode) => {

                return glooko
                  .getBoluses(glookoCookie, glookoCode)
                  .then((boluses) => {
                    assert.ok(Array.isArray(boluses));
                  });
              });
          });
      });
    });
  });
});