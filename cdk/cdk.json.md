```json

{
  "app": "node dist/app.js",
  "context": {
    "@aws-cdk/aws-lambda-nodejs:useLatestRuntimeVersion": "true"
  }
}
```

- alternate
```json

{
  "app": "npx ts-node --prefer-ts-exts app.ts"
}

```