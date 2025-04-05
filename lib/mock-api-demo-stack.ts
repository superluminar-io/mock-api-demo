import * as cdk from 'aws-cdk-lib';
import { MockIntegration, PassthroughBehavior, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { getPathResponseMapping } from '../scripts/get-path-response-mapping';
import { readFileSync } from 'fs';
import * as nock from 'nock';

export class MockApiDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new RestApi(this, `FogisMockApi`, {
      description: `Mock Fogis API`,
    });

    const rawMockRecordings = JSON.parse(readFileSync('./nock-recordings/api.json', 'utf8')) as nock.Definition[];
    const pathResponseMapping = getPathResponseMapping(rawMockRecordings);


    pathResponseMapping.forEach(pathResponse => {
      let resource = api.root;
      const pathParts = pathResponse.path.split('/').filter(part => part.length > 0);
      for (const part of pathParts) {
        resource = resource.getResource(part) || resource.addResource(part);
      }
      resource.addMethod('GET', new MockIntegration({
        requestTemplates: {
          'application/json': '{ "statusCode": 200 }'
        },
        integrationResponses: [
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': JSON.stringify(pathResponse.response),
            },
          },
        ],
        passthroughBehavior: PassthroughBehavior.NEVER,
      }), {
        methodResponses: [
          { statusCode: '200' }
        ]
      });
    });
  }
}
