const AWS = require('aws-sdk');

var sns = new AWS.SNS();

AWS.config.update({region: process.env.AWS_REGION});

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

const sendEmailToSubscribers = async function(message) {
    const params = {
        Message: message,
        TopicArn: snsParams.TopicArn
    };

    const result = await sns.publish(params).promise();
    console.log(result + " email sent ");
};

module.exports = {subscribeToTopic, sendEmailToSubscribers};