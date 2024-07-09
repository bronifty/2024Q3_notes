### aws sdk v3 for js notes app

- using class pattern with handlers and their permissions passed dynamically

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

### aws cdk examples > websocket lambda dynamodb

- using low level cfn apis for apigateway
