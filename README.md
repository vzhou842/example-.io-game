### Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Tests](#tests)
- [Contribute](#contribute)
- [License](#license)



<h1 align="center">
    <img alt="An Example .io Game" title="An Example .io Game" src="https://github.com/vzhou842/example-.io-game/blob/master/public/assets/icon.svg" width="140"> <br />
    An Example .io Game
</h1>
<h4 align="center">
  <a href="https://example-io-game.victorzhou.com">https://example-io-game.victorzhou.com</a>
</h4>

<p align="center">
  <a href="https://travis-ci.com/vzhou842/example-.io-game">
    <img src="https://travis-ci.com/vzhou842/example-.io-game.svg?branch=master" alt="Build Status"></img>
  </a>
</p>

An example multiplayer (.io) web game. Read the walkthrough: [**How to Build a Multiplayer (.io) Web Game**](https://victorzhou.com/blog/build-an-io-game-part-1/).

Built with [Node.js](https://nodejs.org/), [socket.io](https://socket.io/), and [HTML5 Canvas](https://www.w3schools.com/html/html5_canvas.asp).

To see this code with [Flow](https://flow.org/) typing, visit the [flow branch](https://github.com/vzhou842/example-.io-game/tree/flow).

## Features

 -  Demonstrate the creation of a sample multiplayer .io game similar to ones such as agar.io
 -  Javascript implementation with ability to run build of game locally
 -  Unit tests for verification of functionality

## Installation

To get started, make sure you have the following prerequisits installed:

1. Node
For Windows, use the official installer found at https://nodejs.org/en

For MacOS (using homebrew)
```bash
brew install node
```

2. NVM
For Windows, use the VNM for Windows installer from this [Github Repository](https://github.com/coreybutler/nvm-windows/releases)

For MacOS (using homebrew)
```bash
brew install nvm
```


Then, to run the game on your local machine, run the following commands:

```bash
$ npm install
$ npm run develop
```

To access and play the example io game, enter 

```bash
http://localhost:3000
```

in your web browser of choice.
By default, the port is set to 3000.
You may change the port to one of your choosing (e.g., 80, 443, etc.) by modifying the file 
[server.js](src/server/server.js)

To run the project in a production setting, simply enter the following commands in your terminal:

```bash
$ npm install
$ npm run build
$ npm start
```

## Tests

To run the tests for this this project, simply

```bash
$ npm install
$ npm test
```


## Contribute

Source Code: https://github.com/vzhou842/example-.io-game/tree/master/src


## License

This Project is licensed under the MIT License and is Copyright (c) 2019 Victor Zhou.

For more license terms and details, please refer to the [LICENSE](LICENSE).