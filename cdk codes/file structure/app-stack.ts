import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

function getSuffixFromStack(stack: cdk.Stack) {
  const shortStackId = cdk.Fn.select(2, cdk.Fn.split("/", stack.stackId));
  const suffix = cdk.Fn.select(4, cdk.Fn.split("-", shortStackId));
  return suffix;
}

class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // dynamically get suffix from stack
    const suffix = getSuffixFromStack(this);
    // CfnParameter
    const myBucketName = new cdk.CfnParameter(this, "myBucketName", {
      default: "bronifty-cdk-cloudfront-kv",
    });

    const deploymentBucket = new cdk.aws_s3.Bucket(this, "uiDeploymentBucket", {
      bucketName: `${myBucketName.valueAsString}-${suffix}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const table = new cdk.aws_dynamodb.Table(this, "notes", {
      partitionKey: {
        name: "noteId",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      billingMode: cdk.aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
