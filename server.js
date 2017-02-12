'use strict';

const hapi = require('hapi');
const config = require('./config.js');
const oauth = require('./lib/oauth.js');

// Routes
const authorization = require('./routes/authorization.js');

const server = new hapi.Server();
server.connection({
    host: process.env.HOST,
    port: process.env.PORT
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('App running. Waiting...');
    }
});

server.route({
    method: 'GET',
    path: '/fitbit-authorization',
    handler: authorization
});

server.route({
    method: 'GET',
    path: '/slack-authorization',
    handler: authorization
});

// Start
server.start((error) => {
    if (error) {
        throw error;
    }

    console.log(`Server running at: ${server.info.uri}`);
});