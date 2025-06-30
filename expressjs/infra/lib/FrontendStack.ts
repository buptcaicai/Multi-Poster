import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Create S3 bucket (or use fromBucketName to import existing)
    const siteBucket = new s3.Bucket(this, 'ExpressFrontend', {
      publicReadAccess: false,
      websiteIndexDocument: 'index.html',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // 2. Deploy local frontend build folder to the bucket
    new s3deploy.BucketDeployment(this, 'ExpressFrontend', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../react/build'))],
      retainOnDelete: false,
      destinationBucket: siteBucket,
    });

    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: siteBucket.bucketWebsiteUrl,
    });
  }
}
