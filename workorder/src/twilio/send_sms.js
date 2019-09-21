// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'ACf8dbd03481d0f69325cee1a3284434d7';
const authToken = '359e4fd7c507e8fc06d6cb697f075c5d';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'ALERT: New Work Order #12345. Location: x, Time: x. Reply YES to accept, NO to decline.',
        from: '+14422640841',
        to: '+19492957381'  // replace with user.number
    })
    .then(message => console.log(message.sid));