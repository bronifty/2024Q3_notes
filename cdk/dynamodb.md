```ts
export class AwsSdkJsNotesAppStack extends Stack {

constructor(scope: Construct, id: string, props?: StackProps) {

super(scope, id, props);

  

const table = new dynamodb.Table(this, "notes", {

partitionKey: { name: "noteId", type: dynamodb.AttributeType.STRING },

billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Set to pay-per-request

removalPolicy: RemovalPolicy.DESTROY, // Ensure the table is destroyed when the stack is deleted

});

  

// ... existing code ...

}

}
```