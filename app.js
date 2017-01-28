'use strict';

const hapi = require('hapi');
const oauth = require('./lib/oauth.js');

const server = new hapi.server();
server.connection({
    host: 'localhost',
    port: 3000
});

server.route({
    method: 'GET',
    path: '/fitbit-authorization',
    handler: function (request, reply) {
        // Handle implicit grant flow
        if (request.query.access_token === undefined) {
            console.log('No accesss token detected.');
            console.log('Sending user through Fitbit authorization.');

            reply.redirect(oauth.getImplicitAccessToken(config.fitbit));
        } else if (request.query.access_token !== undefined) {
            let accessToken = request.query.access_token;
            console.log(`Access token found: ${accessToken}`);
        }
    }
});

// Start server
server.start((error) => {
    if (error) {
        throw error;
    }

    console.log(`Server running at: ${server.info.uri}`);
});