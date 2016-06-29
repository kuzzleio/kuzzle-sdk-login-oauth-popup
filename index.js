if (typeof Kuzzle === 'undefined') {
  throw new Error('kuzzle-sdk-login-oauth-popup needs the Kuzzle Javascript SDK in order to be working.');
}

if (!window) {
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

    var interval = setInterval(() => {
      var c = /code=([a-zA-Z0-9\-_\/]+)/.exec(oauthWindow.location.search);
      console.log(c);
      if (c) {
        oauthWindow.close();
        clearInterval(interval);
        this.query({controller: 'auth', action: 'login'}, {body: {strategy, code: c[1]}}, (err, res) => {
          if (err) {
            cb(err);
            return;
          }
          this.setJwtToken(res.result.jwt);
          cb(undefined, res.result);
        });
      }
    }, 1000);
  });
};