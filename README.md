[![Build Status](https://travis-ci.org/kuzzleio/kuzzle-sdk-login-oauth-popup.svg?branch=master)](https://travis-ci.org/kuzzleio/kuzzle-sdk-login-oauth-popup)

# Description

kuzzle-sdk-login-oauth-popup is an extension for the [Kuzzle javascript-sdk](https://github.com/kuzzleio/sdk-javascript).
 
It's meaning is to add the loginOauthPopup method to your SDK Kuzzle instance to be able to login with an OAUTH strategy by opening a popup to the chosen provider.

# Prerequisite

You need to have the Kuzzle javascript SDK included in your project in order to make it work.

```sh
$ bower install kuzzle-sdk
```

```html
<script src="sdk-javascript/dist/kuzzle.js"></script>
```

# Definition

```js
loginOauthPopup(strategy, [options], [callback])

| Arguments | Type | Description | Default
|---------------|---------|----------------------------------------|
| ``strategy`` | string | The strategy to use |
| ``options`` | string | Options that will be given to the window.open | 'width=800, height=600'
| ``cb`` | Function | The callback |

```

# Installation

```sh
$ bower install kuzzle-sdk-login-oauth-popup
```

```html
<script src="kuzzle-sdk-login-oauth-popup/index.js"></script>
```

# Usage

```js
var kuzzle = new Kuzzle('http://localhost');
kuzzle.loginOauthPopup('facebook', function(err, res) {
    // res should contain the _id and jwt token of the logged user
});
```
