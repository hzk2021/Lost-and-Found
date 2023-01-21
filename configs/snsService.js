const AWS = require('aws-sdk');

var sns = new AWS.SNS();


const subscribeToTopic = function(email) {
    sns.subscribe({
        Protocol: "email",
        TopicArn: "arn:aws:sns:us-east-1:241830745514:ReportedItemsNotification",
        Endpoint: email
    }, function(err, data) {
        if (err) console.log(err, err.stack);
        else     console.log(data);
    }
    );
};

module.exports = {subscribeToTopic};