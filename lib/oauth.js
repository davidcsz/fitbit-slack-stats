const fetch = require('node-fetch');
const encode = require('./encode.js');

exports.formAuthorizationUri = (config) => {
    return new Promise ((fulfill, reject) => {
        if (config.client.id === undefined || config.client.secret === undefined || config.uri.authorization === undefined || config.uri.redirect === undefined || config.scope === undefined) {
            reject('Not enough information to form authorization URL');
        } else {
            if (config.responseType !== undefined) {
                fulfill(`${config.uri.authorization}?client_id=${encodeURI(config.client.id)}&response_type=${encodeURI(config.responseType)}&scope=${encodeURI(config.scope)}&redirect_uri=${encodeURIComponent(config.uri.redirect)}`);
            } else if (config.responseType === undefined) {
                fulfill(`${config.uri.authorization}?client_id=${encodeURI(config.client.id)}&scope=${encodeURI(config.scope)}&redirect_uri=${encodeURIComponent(config.uri.redirect)}`);
            }
        }
    });
}

exports.getAccessToken = (config) => {
    return new Promise ((fulfill, reject) => {
        let encodedClientCredentials = encode.base64(`${config.client.id}:${config.client.secret}`);

        fetch(config.uri.token, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodedClientCredentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `code=${encodeURI(config.code)}&grant_type=authorization_code&redirect_uri=${encodeURI(config.uri.redirect)}`
        }).catch((error) => {
            let tokenError = error.json();
            reject(tokenError);
        }).then((response) => {
            return response.json().catch((parseError) => {
                console.log(`Error parsing token: ${parseError}`);
                reject(parseError);
            });
        }).then((accessToken) => {
            fulfill(accessToken);
        });
    });
}