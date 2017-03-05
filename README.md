# Crawletto ![travis status](https://travis-ci.org/beuted/Crawletto.svg?branch=master) [![Deploy](https://beuted.github.io/Crawletto/deploy-to-heroku.svg)](https://heroku.com/deploy)

### *Work in progress*

Phaser project of a turn based multiplayer game inspired by nethack

## Play the [Demo on Heroku](https://crawletto.herokuapp.com/) or [![Deploy](https://beuted.github.io/Crawletto/deploy-to-heroku.svg)](https://heroku.com/deploy)

## Commands
* **D**: enter debug-mode
* **SPACEBAR**: Attack in front of you
* **Arrow keys:** move around

## Features
* _Multiplayer_ enabled using [Socket.io](http://socket.io/) (the players can see eachothers moving on the different maps)
* Feild of view of the player computed with a _recursive shadowcasting_
* basic _AI_ for mobs
* _infinite world_ with Maps generated as the user moves
* _Randomly generated maps_ based on a seed ([Seedrandom](https://github.com/davidbau/seedrandom)) _(removed atm for the infinite world feature)_

## Setup project
* [Install node](https://nodejs.org/)
* At the root of the repo Type `npm install` (that will also retrieve the bower dependencies, and the .d.ts files)
* Type `grunt` and wait few seconds (that will build the typescript of the server and the client)
* Start the server with `node app.js`
* Connect to `localhost:3000` with as many browsers as you want and play with your friends!

## Technos used

**In Client**
* [Phaser](http://www.phaser.io/)
* ~~[Phaser Isometric Plugin](http://www.rotates.org/phaser/iso/)~~ -> I moved to vanilla Phaser
* [easystar.js](http://www.easystarjs.com/)

**In Client & Server**
* [Lodash](https://lodash.com/)
* [Requirejs](http://requirejs.org/)
* [Socket.io](http://socket.io/)
* [Typescript](http://www.typescriptlang.org/)
* [DefinitlyTyped](http://definitelytyped.org/)

**In Server**
* [Nodejs v4.2.2](https://nodejs.org)
* [Express](http://expressjs.com/)
* [Seedrandom](https://github.com/davidbau/seedrandom)

## Development grunt commands
* `grunt ts:public`: Compile the typescript client files
* `grunt ts:server`: Compile the typescript server files
* `grunt dev-server`: Run a watch on the server files, compiling the typescript files and restarting the node server
* `grunt dev-public`: Run a watch on the client files, compiling the typescript files
* `grunt dev`: Run both watches
* `npm run test`: Run unit tests (note: needs jasmine node installed `npm install jasmine-node -g`)
* `npm run play`: Alias for `grunt ts:server ts:public && node app.js`

Note: I've added the node package _devloop_ just install it and run `loop` to dev with it.

## Licence
**MIT**
