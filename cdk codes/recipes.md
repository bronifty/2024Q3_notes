### Stack Suffix

```ts
// ./utils.ts
import * as cdk from "aws-cdk-lib";

export function getSuffixFromStack(stack: cdk.Stack) {
  const shortStackId = cdk.Fn.select(2, cdk.Fn.split("/", stack.stackId));
  const suffix = cdk.Fn.select(4, cdk.Fn.split("-", shortStackId));
  return suffix;
}
```

This method is using AWS CloudFormation intrinsic functions (`Fn.split` and `Fn.select`) to generate a unique suffix for the S3 bucket name. Here's what's happening:

1. `this.stackId`: This is a property of the `Stack` class that represents the unique ID of the stack. It typically looks like `arn:aws:cloudformation:region:account-id:stack/stack-name/uuid`.

2. `Fn.split("/", this.stackId)`: This splits the `stackId` string at each "/" character. The result is an array that looks like:

   `["arn:aws:cloudformation:region:account-id:stack", "stack-name", "uuid"]`

3. `Fn.select(2, ...)`: This selects the third element (index 2) from the split array, which is the `"uuid"` part.

4. `const shortStackId = ...`: This assigns the selected `"uuid"` to `shortStackId`.

5. `Fn.split("-", shortStackId)`: This further splits the `uuid` at each "-" character. A typical UUID looks like `"12345678-1234-1234-1234-123456789012"`, so this results in an array like:

   `["12345678", "1234", "1234", "1234", "123456789012"]`

6. `Fn.select(4, ...)`: This selects the fifth element (index 4) from the split UUID, which is the last part `"123456789012"`.

7. `this.stackSuffix = ...`: This assigns the selected part of the UUID to `this.stackSuffix`.

The purpose of this code is to create a unique identifier for the S3 bucket name. It's using part of the stack's UUID to ensure that the bucket name is unique across different deployments of the same stack.

In the constructor, this suffix is then used to create a unique bucket name:

```ts
// stack.ts
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { getSuffixFromStack } from "./utils";

export class CourseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stackSuffix = getSuffixFromStack(this);

    new cdk.aws_s3.Bucket(this, "CourseBucket", {
      bucketName: `course-bucket-${stackSuffix}`,
    });
  }
}
```

This ensures that each time you deploy this stack, it creates a bucket with a unique name, avoiding naming conflicts if you deploy multiple instances of this stack.

------

### HTTP Requests
- in a file with an http extension type the url and the REST Client (humao) will provide a 'send request' button

