import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as logs from 'aws-cdk-lib/aws-logs';
export class EcrStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myIP = process.env.MY_IP;

    if (!myIP) {
      throw new Error('MY_IP environment variable is not set');
    }

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2 });

    const dockerImage = new ecr_assets.DockerImageAsset(this, 'backend-express', {
      directory: '../expressjs',
    });

    const cluster = new ecs.Cluster(this, 'simple-express-cluster', { vpc });

    const taskDef = new ecs.FargateTaskDefinition(this, 'express-backend-task', {
      cpu: 256,
      memoryLimitMiB: 512,
    });

    taskDef.addContainer('backendContainer', {
      image: ecs.ContainerImage.fromDockerImageAsset(dockerImage),
      portMappings: [{ containerPort: 3000 }],
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'express-backend',
        logRetention: logs.RetentionDays.ONE_DAY
      })
    });

    const service = new ecs.FargateService(this, 'simple-express-service', {
      cluster,
      taskDefinition: taskDef,
      capacityProviderStrategies: [
        {
          capacityProvider: 'FARGATE_SPOT',
          weight: 1
        },
      ],
      desiredCount: 2,
      assignPublicIp: true,
    });

    const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc,
      internetFacing: true,
    });

    // Listener on port 80
    const listener = alb.addListener('Listener', {
      port: 80,
      open: false
    });

    listener.connections.allowFrom(ec2.Peer.ipv4(myIP), ec2.Port.tcp(80), 'Allow HTTP traffic from my IP');

    // Attach service to the ALB
    listener.addTargets('ECS', {
      port: 80,
      targets: [service],
      healthCheck: {
        path: '/',
        port: '3000',
      },
    });

    // Output the ALB DNS name
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: alb.loadBalancerDnsName,
    });
    
  }
}
