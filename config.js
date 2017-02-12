// require('dotenv').config();

module.exports = {
    host: process.env.HOST,
    port: process.env.PORT,
    fitbit: {
        client: {
            id: process.env.FB_ID,
            secret: process.env.FB_SECRET
        },
        uri: {
            authorization: 'https://www.fitbit.com/oauth2/authorize',
            token: 'https://api.fitbit.com/oauth2/token',
            redirect: `https://${process.env.R_HOST}/fitbit-authorization`
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
            redirect: `https://${process.env.R_HOST}/slack-authorization`
        },
        scope: 'chat:write:bot'
    }
};