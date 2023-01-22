const AWS = require('aws-sdk');

var sns = new AWS.SNS();

var snsParams = {
    Protocol: "email",
    TopicArn: process.env.SNS_TOPIC_ARN
};

const subscribeToTopic = function(email) {
    sns.subscribe({
        Protocol: snsParams.Protocol,
        TopicArn: snsParams.TopicArn,
        Endpoint: email
    }, function(err, data) {
        if (err) console.log(err, err.stack);
        else     console.log(data);
    }
    );
};

module.exports = {subscribeToTopic};