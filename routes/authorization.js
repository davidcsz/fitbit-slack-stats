const encode = require('./../lib/encode.js');
const oauth = require('./../lib/oauth.js');
const config = require('./../config.js');

module.exports = (request, reply) => {
    let currentConfig;

    console.log(`Request: ${request.path}`);
    if (request.path === '/fitbit-authorization') {
        currentConfig = config.fitbit;
    }
    
    if (request.path === '/slack-authorization') {
        currentConfig = config.slack;
    }

    if (request.query.code === undefined) {
        console.log('Authorizing user...');

        oauth.formAuthorizationUri(currentConfig).then((authUrl) => {
            reply('Authorizing...').redirect(authUrl);
        });
    } else if (request.query.code !== undefined) {
        currentConfig.code = request.query.code;

        console.log(`Getting access token with auth code...`);
        oauth.getAccessToken(currentConfig).catch((error) => {
            console.log(`Error requesting token: ${error}`);

            reply(error);
        }).then((accessToken) => {
            console.log('Got access token: ');
            console.log(accessToken);

            reply(accessToken);
        });
    }
}