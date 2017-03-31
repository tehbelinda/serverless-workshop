# Serverless Workshop

A guided workshop to setting up a basic Serverless project.
By the end we should have a Slack command that uses a Lambda function to write files into an S3 bucket.


## Setup

We will be using AWS as our cloud provider. Make sure you have AWS credentials setup: 
https://serverless.com/framework/docs/providers/aws/guide/credentials/

Install node and npm: https://nodejs.org

Clone this repo
```
git clone https://github.com/tehbelinda/serverless-workshop.git
```

Install this project's dependencies. So far it's just the serverless package. 
```
cd serverless-workshop
npm install
```

For convenience, sls is added to the package.json script so it can be accessed via
```
npm run sls
```

## Service Creation

Create new serverless service using the AWS NodeJS template.

```
npm run sls -- create --template aws-nodejs --name myService
```

This should create the configuration file (serverless.yml) and a sample function (handler.js)
that prints out a message.

Update your stage to your name in serverless.yml
```yaml
# you can overwrite defaults here
#  stage: dev <-- UPDATE THIS
#  region: us-east-1
```

Let's test that this works so far. Deploy your stack

```
npm run sls -- deploy
```

You should be able to view its progress in 
https://console.aws.amazon.com/cloudformation

Once that's done, we can see our Lambda function in
https://console.aws.amazon.com/lambda
To check everything is working, hit the Test button and save. 

## AWS Resources

We will configure AWS resources using CloudFormation in serverless.yml so that we represent
infrastructure as code.

Note use of variables

```yaml
# you can add CloudFormation resource templates here
resources:
  Resources:
    MyServiceBucket:
      Type: AWS::S3::Bucket
      Properties:
        BucketName: serverless-workshop-${self:provider.stage}
```

## Lambda function

Now lets make our Lambda function write to the S3 bucket. Instead of hello, call it
writeToS3.

In serverless.yml

```yaml
functions:
  writeToS3:
    description: Writes a file to S3
    handler: handler.writeToS3
```

In handler.js

```javascript
module.exports.writeToS3 = (event, context, callback) => {
```

Next we need to tell our Lambda function which bucket to use. 
We can do this by passing in the resource's logical ID into the function specific environment variables.

```yaml
writeToS3:
  description: Writes a file to S3
  handler: handler.writeToS3
  bucket:
    Ref: MyServiceBucket
```

Deploy. 

```bash
npm run sls -- deploy
```

If you look at the Lambda web console now, you should see it in the "Environment variables" 
section at the bottom of the Code tab.

Now let's write to S3. At the top of handler.js, import the AWS SDK. They have automatically
made this available as part of the Lambda NodeJS environment.

```javascript
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
```

Make the S3 API call.

```javascript
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
```

Since we only changed the function, we don't need to deploy the whole Serverless stack

```bash
npm run sls -- deploy function --function writeToS3
```

Try running the function with "Test" button again now.

## Permissions

It didn't work! Your Lambda function was denied access. This is because we haven't set up any permissions.

We'll need to give the IAM (Identity & Access Management) role of the Lambda permission to write to 
the S3 bucket in serverless.yml. Unfortunately Serverless don't support individual IAM roles per 
Lambda function just yet so this will apply to all Lambda functions in this service.

```yaml
# you can add statements to the Lambda function's IAM Role here
  iamRoleStatements:
    - Effect: Allow
      Action: s3:PutObject
      Resource:
        Fn::Join:
          - ""
          - - "arn:aws:s3:::"
            - Ref: MyServiceBucket
            - "/*"
```

Deploy the stack.

```bash
npm run sls -- deploy
```


## Slack Integration

- Slack hook
