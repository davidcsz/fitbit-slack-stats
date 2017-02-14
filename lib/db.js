const mongo = require('mongodb');

let mongoUrl = process.env.MONGODB_URI;
let activeCollection = 'authorizations';

const connectToDatabase = (dbUrl) => {
    return mongo.MongoClient.connect(dbUrl).catch((error) => {
        console.log(`Error connecting to database: ${error}`);
    });
}

exports.addNewAuthorization = (user) => {
    return connectToDatabase(mongoUrl).then((database) => {
        let collection = database.collection(activeCollection);

        collection.insert({
            fb_id: user.id.fitbit,
            sl_id: user.id.slack,
            fb_access_token: user.token.access.fitbit,
            fb_refresh_token: user.token.refresh.fitbit,
            sl_access_token: user.token.access.slack,
            sl_refresh_token: user.token.refresh.slack
        });

        database.close();
    });
}

exports.updateUserToken = (user) => {
    if (user.fb_id !== undefined) {
        return connectToDatabase(mongoUrl).then((database) => {
            let collection = database.collection(activeCollection);

            collection.update({fb_id: user.fb_id}, {
                $set: {
                    fb_access_token: user.access_token,
                    fb_refresh_token: user.refresh_token
                }
            }, (error, result) => {
                if (error) {
                    database.close();
                    return `Error updating tokens for Fitbit user ${user.fb_id}: ${error}`;
                } else {
                    database.close();
                    return `Successfully updated tokens for Fitbit user: ${user.fb_id}`;
                }
            });
        });
    } else if (user.sl_id !== undefined) {
        return connectToDatabase(mongoUrl).then((database) => {
            let collection = database.collection(activeCollection);

            collection.update({sl_id: user.sl_id}, {
                $set: {
                    sl_access_token: user.access_token,
                    sl_refresh_token: user.refresh_token
                }
            }, (error, result) => {
                if (error) {
                    database.close();
                    return `Error updating tokens for Slack user ${user.sl_id}: ${error}`;
                } else {
                    database.close();
                    return `Successfully updated tokens for Slack user: ${user.sl_id}`;
                }
            });
        });
    }
}

exports.getTokens = (user) => {
    return connectToDatabase(mongoUrl).then((database) => {
        let collection = database.collection(activeCollection);

        if (user.fb_id !== undefined) {
            collection.find({fb_id: user.fb_id}).toArray((error, document) => {
                if (error) {
                    database.close();
                    return `Error getting tokens for Fitbit usser ${user.fb_id}: ${error}`;
                }

                if (document.length > 1) {
                    database.close();
                    return `Duplicate documents for Fitbit user ${user.fb_id}!`;
                }

                database.close();
                let tokens = document[0];

                return {
                    fb_id: tokens.fb_id,
                    access_token: tokens.fb_access_token,
                    refresh_token: tokens.fb_refresh_token
                };
            });
        } else if (user.sl_id !== undefined) {
            collection.find({sl_id: user.sl_id}).toArray((error, document) => {
                if (error) {
                    database.close();
                    return `Error getting tokens for Slack usser ${user.sl_id}: ${error}`;
                }

                if (document.length > 1) {
                    database.close();
                    return `Duplicate documents for Slack user ${user.sl_id}!`;
                }

                database.close();
                let tokens = document[0];

                return {
                    sl_id: tokens.sl_id,
                    access_token: tokens.sl_access_token,
                    refresh_token: tokens.sl_refresh_token
                };
            });
        }
    });
}

// let updateUser = {
//     sl_id: 'whatever',
//     access_token: 'token',
//     refresh_token: 'token'
// }

// let newUser = {
//     id: {
//         fitbit: 'fitbitId',
//         slack: 'slackId'
//     },
//     token: {
//         access: {
//             fitbit: 'fbaccesstoken',
//             slack: 'slackaccesstoken'
//         },
//         refresh: {
//             fitbit: 'fbrefresh',
//             slack: 'slrefresh'
//         }
//     }
// };

// let doc = {
//     fitbit_id: 'fitbitId',
//     slack_id: 'slackId',
//     fb_access_token: 'fb-access-token',
//     sl_access_token: 'sl-access-token',
//     fb_refresh_token: 'fb-refresh-token',
//     sl_refresh_token: 'sl-refresh-token'
// }