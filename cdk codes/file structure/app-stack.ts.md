````ts
export class AwsSdkJsNotesAppStack extends Stack {

constructor(scope: Construct, id: string, props?: StackProps) {

super(scope, id, props);



const table = new dynamodb.Table(this, "notes", {
partitionKey: { name: "noteId", type: dynamodb.AttributeType.STRING },
billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
removalPolicy: RemovalPolicy.DESTROY,
});

const myBucket = new cdk.aws_s3.Bucket(this, "MyBucket", {
      bucketName: mySiteBucketName.valueAsString,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });


// ... existing code ...

}

}```
````
