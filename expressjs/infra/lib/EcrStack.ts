import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';

export class EcrStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repository = new ecr.Repository(this, 'MyRepository', {
      repositoryName: 'simple-express-repo',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const dockerImage = new ecr_assets.DockerImageAsset(this, 'backend-express', {
      directory: '../expressjs',
    });

    new cdk.CfnOutput(this, 'RepositoryUri', {
      value: repository.repositoryUri,
    });

    new cdk.CfnOutput(this, 'ImageUri', {
      value: dockerImage.imageUri,
    });
  }
}
