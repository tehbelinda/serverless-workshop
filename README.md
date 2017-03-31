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

Create new serverless service

```
serverless create --template aws-nodejs --name myService
```

## AWS Resources

- Configure AWS resources using CloudFormation in serverless.yml

## Slack Integration

- Slack hook
