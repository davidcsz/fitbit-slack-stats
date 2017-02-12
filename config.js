let redirect; 

if (process.env.R_PORT === undefined) {
    redirect = `https://${process.env.R_HOST}`;
} else if (process.env.R_PORT !== undefined) {
    redirect = `http://${process.env.HOST}:${process.env.R_PORT}`;
}

module.exports = {
    host: process.env.HOST,
    port: process.env.R_PORT,
    fitbit: {
        client: {
            id: process.env.FB_ID,
            secret: process.env.FB_SECRET
        },
        uri: {
            authorization: 'https://www.fitbit.com/oauth2/authorize',
            token: 'https://api.fitbit.com/oauth2/token',
            redirect: `${redirect}/fitbit-authorization`
        },
        scope: 'activity heartrate location nutrition profile settings sleep social weight',
        responseType: 'code'
    },
    slack: {
        client: {
            id: process.env.SL_ID,
            secret: process.env.SL_SECRET
        },
        uri: {
            authorization: 'https://slack.com/oauth/authorize',
            token: 'https://slack.com/api/oauth.access',
            redirect: `${redirect}/slack-authorization`
        },
        scope: 'chat:write:bot'
    }
};