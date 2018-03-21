# p36-hours [WIP]

Time tracker web app, local storage with pouch-db and syncronization possibilities with an external server

[DEMO](0000marcell.github.io/p36-hours/#/clock)

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd p36-hours`
* `yarn install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Running Tests

* `ember test`
* `ember test --server`

all tests are named, to run a specific test:

`ember test -s -f <part of the name of the test>`

example:

`ember test -s -f unit-statistics-01`

some tests are falling because of a bug when closing pouch-db, but the tests are actually green.

### Deploying

If you wanna deploy your own version of the app using gh-pages:

after forking the app and installing everything.

`ember deploy production`

the app will be hosted at "<your-username>.github.io/p36-hours/#/clock"


## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
