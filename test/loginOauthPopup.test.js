var
  should = require('should'),
  sinon = require('sinon'),
  clock = sinon.useFakeTimers(),
  path = require('path'),
  rewire = require('rewire'),
  sandbox;

describe('Test loginOauthPopup', function() {

  var
    kuzzle;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should throw an error because Kuzzle sdk is not included in the project', function() {
    (function(){
      require('..');
    }).should.throw('kuzzle-sdk-login-oauth-popup needs the Kuzzle Javascript SDK in order to be working.');
  });

  it('should throw an error because it is not in a browser', function() {
    Kuzzle = sandbox.stub();
    (function() {
      require('..');
    }).should.throw('kuzzle-sdk-login-oauth-popup only work in a browser.');
  });

  it('should throw an error because the popup cannot be open', function() {
    Kuzzle = function() {
      this.login = function(strategy, cb) {
        cb(undefined, {headers: { Location: 'fake'}});
      };
      this.query = sandbox.stub();
    };
    window = sandbox.stub();
    window.open = sandbox.stub().returns(undefined);
    rewire('..');
    kuzzle = new Kuzzle();
    (function() {
      kuzzle.loginOauthPopup('strategy');
    }).should.throw('Cannot open window. Make sure it isn\'t blocked by your browser.');
  });

  it('should call query to give code to kuzzle and call the callback with a jwt token', function() {
    Kuzzle = function() {
      this.login = function(strategy, cb) {
        cb(undefined, {headers: { Location: 'fake'}});
      };
      this.query = sandbox.spy();
    };
    window = sandbox.stub();
    window.open = sandbox.stub().returns({
      location: {search: 'code=42'},
      close: sandbox.stub()
    });
    rewire('..');
    kuzzle = new Kuzzle();
    kuzzle.loginOauthPopup('strategy');
    clock.tick(500);
    should(kuzzle.query.calledOnce).be.true();
  });

});