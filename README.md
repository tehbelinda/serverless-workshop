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



## Slack Integration

- Slack hook
