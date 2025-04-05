# Mock API Demo

This is a demo project for dynamoically generating a mock API with real data using AWS API Gateway and AWS Lambda. It is a demo for this blog post: http://superluminar.io/2025/04/04/generate-mock-apis-from-real-data-using-nock-and-aws-cdk/.

## Disclaimer

⚠️ This demo uses a Harry Potter API, but we want to make it clear that we do not support the views of J.K. Rowling. Our company is committed to a code of conduct that prioritizes inclusivity, respect, and equality for everyone. The purpose of this tutorial is purely technical, focusing on the process of building and deploying a mock API.

## Prerequisites

- Node
- AWS CDK
- AWS Account

## Scripts
The `scripts` folder contains scripts for generating mock data and preprocessing it for the API.
`record-api.ts` is a script that records the API calls and saves them to a file.
`get-path-response-mapping.ts` is a script that reads the recorded API calls and creates a mapping of paths to responses.

## Stacks
The `mock-api-demo-stack.ts` stack contains the API Gateway which uses MockIntegrations to service the mock responses. This requires the `get-path-response-mapping.ts` script.

The `mock-api-proxy-demo-stack.ts` stack contains the API Gateway which uses a proxy with a Lambda function to return the mock responses.

## Functions
The `functions` folder contains the Lambda function for the API - `proxy-lambda.ts`. It is only used in the `mock-api-proxy-demo-stack.ts` stack.
