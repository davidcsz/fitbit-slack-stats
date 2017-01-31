'use strict';

const hapi = require('hapi');
const oauth = require('./lib/oauth.js');
const config = require('./config.js');

const server = new hapi.Server();
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

            let authorizationUrl = oauth.getFitbitImplicitAccessToken(config.appCredentials.dev.fitbit);
            reply('Redirecting to Fitbit authorization...').redirect(authorizationUrl);
        } else if (request.query.access_token !== undefined) {
            let accessToken = request.query.access_token;
            console.log(`Access token found: ${accessToken}`);
        }
    }
});

server.route({
    method: 'GET',
    path: '/slack-authorization',
    handler: function (request, reply) {
        // Handles Slack authorizaiton through Authorization Code Grant Flow
        if (request.query.code === undefined) {
            console.log('No authorization code found.');
            console.log('Sending user through Slack authorization.');

            reply('Getting authorization code...').redirect(oauth.getAuthCode(config.appCredentials.dev.slack));
        } else if (request.query.code !== undefined) {
            console.log('Authorization code detected!');
            console.log('Fetching Slack access token.');

            oauth.getSlackAccessToken(request.query.code, config.appCredentials.dev.slack)
            .then((accessTokenRequestResponse) => {
                console.log(accessTokenRequestResponse);
                reply(`Got access token: ${accessTokenRequestResponse.access_token}`);
            });
        }
    }
})

// Start server
server.start((error) => {
    if (error) {
        throw error;
    }

    console.log(`Server running at: ${server.info.uri}`);
});