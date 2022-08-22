import * as path from 'path';
import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Cors, EndpointType } from 'aws-cdk-lib/aws-apigateway';

export class TuringqDemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "s3-bucket");
  
    const handler = new lambda.DockerImageFunction(this, 'lambda-handler', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, 'handler')),
      memorySize: 2048,
      timeout: Duration.seconds(30),
      environment: {
        BUCKET: bucket.bucketName
      },
    });
    
    bucket.grantReadWrite(handler);
   
    const api = new apigateway.RestApi(this, "api", {
      restApiName: "TuringQDemoService",
      description: "TuringQ Demo Service.",
      endpointConfiguration: {
        types: [
          EndpointType.REGIONAL
        ]
      }   
    });

    const getIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    });

    const calculateResource = api.root.addResource("calculate")
    calculateResource.addMethod("GET", getIntegration)
    calculateResource.addCorsPreflight({
      allowOrigins: Cors.ALL_ORIGINS,
      allowHeaders: Cors.DEFAULT_HEADERS,
      allowMethods: Cors.ALL_METHODS,
    })


    new CfnOutput(this, "s3-out", {
      value: bucket.bucketName,
      description: "S3 Bucket"
    })

    new CfnOutput(this, "api-url", {
      value: api.url,
      description: "API URL"
    })

  }
}
