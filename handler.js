'use strict';

const AWS = require("aws-sdk")
const s3 = new AWS.S3();

module.exports.writeToS3 = (event, context, callback) => {

  // Get the bucket name out of the environment variables.
  const bucket = process.env.bucket;

  // Prepare params for making S3 API call.
  const params = {
    Bucket: bucket,
    Key: "testFile.txt",
    Body: "I am a test text file"
  }

  let message;
  // Make the API call.
  s3.putObject(params, function(err, data) {
    // Check whether it completed successfully.
    if (err) {
      console.log(err, err.stack)
      message = "Something went wrong " + err;
    } else {
      message = "Wrote successfully to " + bucket + " " + data;
    }

    // Trigger final callback now that this function is done.
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: message,
        input: event,
      }),
    };
    callback(null, response);
  })

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};