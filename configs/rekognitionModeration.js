const AWS = require('aws-sdk');

var rekognition = new AWS.Rekognition();

const isInappropriate = async function(buffer) {

    const resizedImageBuffer = await sharp
    const params = {
        Image: {
            Bytes: buffer
        }
    }

    return new Promise(function (resolve, reject) {
        rekognition.detectModerationLabels(params, function(err, data) {
            if (err) console.log(err, err.stack);
            else {
                if (data.ModerationLabels.length > 0) {
                    return resolve(bad = true)
                } else{
                    return resolve(bad = false)
                }
            }
        })
    
    })

};

module.exports = {isInappropriate};