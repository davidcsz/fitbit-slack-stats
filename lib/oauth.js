const fetch = require('node-fetch');
const encode = require('./encode.js');

exports.formAuthorizationUri = async function (config) {
    if (config.client.id === undefined || config.client.secret === undefined || config.uri.authorization === undefined || config.uri.redirect === undefined || config.scope === undefined) {
        return 'Not enough information to form authorization URL';
    } else {
        if (config.responseType !== undefined) {
            return `${config.uri.authorization}?client_id=${encodeURI(config.client.id)}&response_type=${encodeURI(config.responseType)}&scope=${encodeURI(config.scope)}&redirect_uri=${encodeURIComponent(config.uri.redirect)}`;
        } else if (config.responseType === undefined) {
            return `${config.uri.authorization}?client_id=${encodeURI(config.client.id)}&scope=${encodeURI(config.scope)}&redirect_uri=${encodeURIComponent(config.uri.redirect)}`;
        }
    }
}

exports.getAccessToken = async function (config) {
    let accessToken;

    try {
        accessToken = await fetch(config.uri.token, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodedClientCredentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `code=${encodeURI(config.code)}&grant_type=authorization_code&redirect_uri=${encodeURI(config.uri.redirect)}`
        }).then((response) => {
            return response.json().catch((parseError) => {
                console.log(`Error parsing token response: ${parseError}`);
            });
        });
    } catch (error) {
        console.log(`Error fetching token: ${error}`);
        return error;
    }

    return accessToken;
}

exports.refreshAccessToken = async function (config) {
    let accessToken;

    try {
        accessToken = await fetch(config.uri.token, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodedClientCredentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=refresh_token&refresh_token=${config.user.refresh}`
        }).then((response) => {
            return response.json().catch((parseError) => {
                console.log(`Error parsing token: ${parseError}`);
            });
        });
    } catch (error) {
        console.log(`Error refreshing token: ${error}`);
        return error;
    }

    return accessToken;
}