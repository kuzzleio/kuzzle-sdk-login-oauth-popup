if (typeof Kuzzle === 'undefined') {
  throw new Error('kuzzle-sdk-login-oauth-popup needs the Kuzzle Javascript SDK in order to be working.');
}

if (typeof window === 'undefined') {
  throw new Error('kuzzle-sdk-login-oauth-popup only work in a browser.');
}

Kuzzle.prototype.loginOauthPopup = function(strategy, options, cb) {
  var
    oauthWindow,
    windowOption = ((options !== undefined && typeof options !== 'function') ? options : 'width=800, height=600');

  if (!cb && typeof options === 'function') {
    cb = options;
  }
  this.login(strategy, (err, res) => {
    oauthWindow = window.open(res.headers.Location, 'kuzzleOauthPopup', windowOption);
    if (oauthWindow === undefined) {
      throw new Error('Cannot open window. Make sure it isn\'t blocked by your browser.');
    }
    sendCodeToKuzzle(strategy, oauthWindow, cb, this);
  });
};

function sendCodeToKuzzle(strategy, oauthWindow, cb, kuzzle) {
  setTimeout(() => {
    try {
      var c = /code=([a-zA-Z0-9\-_\/]+)/.exec(oauthWindow.location.search);
    } catch (ex) {}

    if (c) {
      oauthWindow.close();
      kuzzle.query({controller: 'auth', action: 'login'}, {body: {strategy, code: c[1]}}, (err, res) => {
        if (err) {
          cb(err);
          return;
        }
        kuzzle.setJwtToken(res.result.jwt);
        cb(undefined, res.result);
      });
    } else {
      sendCodeToKuzzle(strategy, oauthWindow, cb, kuzzle);
    }
  }, 500);
}
