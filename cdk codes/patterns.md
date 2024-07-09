# aws sdk v3 for js notes app

### using class pattern with handlers and their permissions passed dynamically

```ts
const table = new dynamodb.Table(this, "notes", {
  partitionKey: { name: "noteId", type: dynamodb.AttributeType.STRING },
});

const api = new apigw.RestApi(this, "endpoint");
const notes = api.root.addResource("notes");
notes.addMethod(
  "GET",
  new apigw.LambdaIntegration(
    new NotesApi(this, "list", {
      table,
      grantActions: ["dynamodb:Scan"],
    }).handler
  )
);
```

- the cdk.aws_apigateway.RestApi construction is creating a rest api
- api.root.addResource is creating a path on the api
- notes.addMethod is adding an endpoint with the HTTP verb associated
- the nested new cdk.aws_apigateway.LambdaIntegration is adding an event handler to the addMethod listener for GET requests to the /notes path
- inside the integration (callback function for the GET request event) we have a nested new NotesApi created which takes the id of the handler, the dynamodb table and the actions required for the handler to access the table
- method > integration > api is triple nesting!
- here goes the NotesApi class

```ts
import {
  aws_dynamodb as dynamodb,
  aws_lambda_nodejs as lambda,
  aws_iam as iam,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export interface NotesApiProps {
  /** the dynamodb table to be passed to lambda function **/
  table: dynamodb.Table;
  /** the actions which should be granted on the table */
  grantActions: string[];
}

export class NotesApi extends Construct {
  /** allows accessing the counter function */
  public readonly handler: lambda.NodejsFunction;

  constructor(scope: Construct, id: string, props: NotesApiProps) {
    super(scope, id);

    const { table, grantActions } = props;

    // Create an IAM role for the Lambda function
    const lambdaRole = new iam.Role(this, `${id}-lambda-role`, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      description: "Role for Lambda to access DynamoDB",
    });

    // Attach permissions to the role
    const policy = new iam.PolicyStatement({
      actions: grantActions,
      resources: [table.tableArn],
    });
    lambdaRole.addToPolicy(policy);

    // Create the Lambda function and attach the role
    this.handler = new lambda.NodejsFunction(this, id, {
      environment: { NOTES_TABLE_NAME: table.tableName },
      role: lambdaRole, // Associate the role with the Lambda
    });
  }
}
```

- as you can see it gets passed in the handler and table as well as the permissions the handler needs for the table (that's 3 props passed in if we are talking about it in React terms)
- here is the 'list' handler, which gets referenced automatically by its name and location. (the notes api class which constructs a new lambda function based on the properties passed in has the following filename structure: notes-api.ts; the handler has one more dot with the name of the handler function, in this case, "list" so the filename of the handler looks like so: "notes-api.list.ts")

```ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { success, failure } from "./libs/response";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async () => {
  const params = {
    TableName: process.env.NOTES_TABLE_NAME || "",
  };

  try {
    const result = await client.send(new ScanCommand(params));
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
};
```

# aws cdk examples

### websocket lambda dynamodb

- using low level cfn apis for apigateway

# cdk course

### passing props across stacks via interfaces

-

### cfnParameters and cfnOutputs

- [CfnParameter Api Ref](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.CfnParameter.html)

```ts
const myTopic = new sns.Topic(this, "MyTopic");
const url = new CfnParameter(this, "url-param");
myTopic.addSubscription(new subscriptions.UrlSubscription(url.valueAsString));
```

- [CfnOutput Api Ref](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.CfnOutput.html)

```ts
new CfnOutput(this, "MyTopicArn", { value: myTopic.topicArn });
```

> CfnParameter gotcha!
> they can be used to set properties but not the logical id, such as of the bucket. we will have to circle back to this one to set its logical id

> REMINDER! here we set the property bucketName with the CfnParameter, but we can't use it to set the logical id. the course has a workaround for this. 
```ts
export class CourseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // CfnParameter to dynamically set the name
    const mySiteBucketName = new cdk.CfnParameter(this, "mySiteBucketName", {
      default: "bronifty-cdk-cloudfront-kv",
    });

    // S3 bucket
    const myBucket = new cdk.aws_s3.Bucket(this, "MyBucket", {
      bucketName: mySiteBucketName.valueAsString,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
```
