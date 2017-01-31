const fetch = require('node-fetch');

exports.getAuthCode = (appCredentials) => {
    if (appCredentials.response_type !== undefined) {
        let authUrl = appCredentials.auth_url +
        '?client_id=' + appCredentials.client_id +
        '&response_type=' + appCredentials.response_type +
        '&redirect_uri' + appCredentials.redirect_uri +
        '&scope=' + appCredentials.scope;

        return authUrl;
    } else if (appCredentials.response_type === undefined) {
        let authUrl = `${appCredentials.auth_url}?client_id=${encodeURI(appCredentials.client_id)}&redirect_uri=${encodeURI(appCredentials.redirect_uri)}&scope=${encodeURI(appCredentials.scope)}`;

        return authUrl;
    }
}

// Returns a promise that results in the access token request response JSON object 
exports.getAccessToken = (authCode, appCredentials) => {
    return new Promise ((fulfill, reject) => {
        let authHeader = Buffer.from(appCredentials.client_id + ':' + appCredentials.client_secret, 'ascii');

        console.log('Fetching access token...'); 
        fetch(appCredentials.token_endpoint, {
            method: 'POST',
            header: {
                'Authorization': 'Basic ' + authHeader.toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'code=' + authCode + '&grant_type=authorization_code&redirect_uri=' + appCredentials.redirect_url
        }).catch((fetchError) => {
            console.log(`Error in fetching access token: ${fetchError}`);
        }).then((tokenRequestResponse) => {
            console.log('Checking for errors');

            if (tokenRequestResponse.status >= 400) {
                reject(tokenRequestResponse.json());
            } else if (tokenRequestResponse.status < 400 && tokenRequestResponse.status >= 200) {
                return tokenRequestResponse.json();
            } 
        }).then((tokenResponseJson) => {
            fulfill(tokenResponseJson);

            // Returns the following:
            // {
            //     access_token,
            //     token_type,
            //     scope,
            //     expires_in,
            //     refresh_token
            // }
        });
    });
}

exports.refreshAccessToken = (userTokens, appCredentials) =>{
    return new Promise ((fulfill, reject) => {
        let authHeader = Buffer.from(appCredentials.client_id + ':' + appCredentials.client_secret, 'ascii');

        fetch(appCredentials.token_endpoint, {
            method: 'POST',
            header: {
                'Authorization': 'Basic ' + authHeader.toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=refresh_token&refresh_token=' + userTokens.refresh_token
        }).then((refreshRequestResponse) => {
            if (refreshRequestResponse.status >= 400) {
                reject(refreshRequestResponse.json());
            } else if (refreshRequestResponse.status < 400 && refreshRequestResponse.status >= 200) {
                return refreshRequestResponse.json();
            } 
        }).then((refreshResponseJson) => {
            fulfill(refreshResponseJson);

            // Returns the following:
            // {
            //     access_token,
            //     token_type,
            //     scope,
            //     expires_in,
            //     refresh_token
            // }
        });
    }); 
}

// Implicit Grant Flow - Returns an access token as a URL parameter when redirecting back to the app
exports.getFitbitImplicitAccessToken = (appCredentials) => {
    let authorizationPageUrl = `${appCredentials.auth_url}?client_id=${appCredentials.client_id}&response_type=token&scope=${encodeURI(appCredentials.scope)}&redirect_uri=${encodeURI(appCredentials.redirect_uri)}`;

    return authorizationPageUrl;
}