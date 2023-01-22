const AWS = require('aws-sdk');

var bucketParams = {
    Bucket: process.env.S3_BUCKET_NAME, // Other polytechnics would need to update this on their web environment
};

AWS.config.update({region: 'us-east-1'});

var s3 = new AWS.S3({apiVersion: '2006-03-01'});

const createBucket = function() {

    s3.waitFor('bucketNotExists', bucketParams, function(err, data) {
        if (err) console.log(err, err.stack);
        else {
            s3.createBucket(bucketParams, function(err, data) {
                if (err) console.log(err, err.stack);
                else     console.log(`S3 bucket created: ${data.Location}`);
            });
        }
    });
};

const uploadObject = function(objectKey, data, meta_data) {
    s3.upload({
        Bucket: bucketParams.Bucket,
        Key: objectKey,
        Body: data,
        Metadata: {
            "ItemID": meta_data.ItemID,
            "ItemName": meta_data.ItemName,
            "ItemDescription": meta_data.ItemDescription
        }
    }, (err,data) => {
        console.log(err, data);
    });
};

const getImageObject = function(objectKey, callback) {

    let imageBase64 = "";

    s3.getObject({
        Bucket: bucketParams.Bucket,
        Key: objectKey,
    }, (err,data) => {
        if(err) console.log(err);
        callback(data);
        
    });

    return imageBase64;
};

const deleteImageObject = function(objectKey) {
    s3.deleteObject({
        Bucket: bucketParams.Bucket,
        Key: objectKey,
    }, (err,data) => {
        if(err) console.log(err);
        console.log(data);
        
    });
}

module.exports = {bucketParams, createBucket, uploadObject, getImageObject, deleteImageObject};