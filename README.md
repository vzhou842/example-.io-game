<h1 align="center">
    <img alt="MFER Blaster (banner)" title="MFER Blaster" src="https://outerlumen.com/mfer/mfer-blaster-logo.png" width="600"> <br />
    mfer blast
</h1>
<h4 align="center">
  <a href="https://outerlumen.com/mfer/blaster/">https://outerlumen.com/mfer/blaster//a>
</h4>

This is a fork of a multiplayer (.io) web game. Read the original walkthrough: [**How to Build a Multiplayer (.io) Web Game**](https://victorzhou.com/blog/build-an-io-game-part-1/). And THANK YOU to mfer Victor Zhou for the awesome tutorial.

Built with [Node.js](https://nodejs.org/), [socket.io](https://socket.io/), and [HTML5 Canvas](https://www.w3schools.com/html/html5_canvas.asp).

## Development

To get started, make sure you have Node and NPM installed. Then,

```bash
$ npm install
$ npm run develop
```

on your local machine.


## Production

To run the project in a production setting:

```bash
$ npm install
$ npm run build
$ npm start
```

Or with nginx and pm2:

```bash
$ npm install
$ npm run build
$ mv mfer-blaster/blaster /var/www/outerlumen.com/html/mfer/
$ pm2 start npm --name "mfer blast" -- start
```

## Tests

To run the tests for this this project, simply

```bash
$ npm install
$ npm test
```

## pm2

```
$ pm2 start npm --name "mfer blast" -- start
```
