const express = require('express');
const { Command } = require('commander');
const dotenv = require('dotenv');
const dolbyio = require('@dolbyio/dolbyio-rest-apis-client');

const app = express();
const program = new Command();

dotenv.config();

// Parse POST requests as JSON payload
app.use(express.json());

// Serve static files
app.use(express.static('.'));

const APP_KEY = process.env.APP_KEY ?? '';
const APP_SECRET = process.env.APP_SECRET ?? '';

if (APP_KEY.length <= 0 || APP_SECRET.length <= 0) {
    throw new Error('The Application Key and/or Secret are missing!');
}

app.get('/access-token', async (request, response) => {
    console.log(`[GET] ${request.url}`);

    try {
        const accessToken = await dolbyio.communications.authentication.getClientAccessToken(APP_KEY, APP_SECRET, 600);
        
        response.set('Content-Type', 'application/json');
        response.status(200).send(JSON.stringify(accessToken, null, '  '));
    } catch (error) {
        console.error(error);
        response.status(500).send('An error happened.');
    }
});

// Extract the port number from the command argument
program.option('-p, --port <portNumber>', 'Port number to start the HTTP server on.');
program.parse(process.argv);

let portNumber = 8081; // Default port number
const options = program.opts();
if (options.port) {
    const p = parseInt(options.port, 10);
    if (!isNaN(p)) {
        portNumber = p;
    }
}

// Starts an HTTP server
const server = app.listen(portNumber, function () {
    const address = server.address();
    console.log('Dolby.io Spatial Audio application is now listening at http://%s:%s', address.address, address.port);
});
