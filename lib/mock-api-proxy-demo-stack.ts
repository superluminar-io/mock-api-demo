import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import path from 'path';

export class MockApiProxyDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new RestApi(this, `ProxyMockApi`, {
      description: `Mock Proxy API`,
    });

    const proxyLambda = new NodejsFunction(this, 'ProxyLambda', {
      entry: path.join(__dirname, '..', 'functions', 'proxy-lambda.ts'),
      handler: 'handler',
    });

    api.root.addResource('{proxy+}')
      .addMethod('GET', new LambdaIntegration(proxyLambda, {
        proxy: true,
      }));
  }
}
