import * as cdk from "aws-cdk-lib";

export function getSuffixFromStack(stack: cdk.Stack) {
  const shortStackId = cdk.Fn.select(2, cdk.Fn.split("/", stack.stackId));
  const suffix = cdk.Fn.select(4, cdk.Fn.split("-", shortStackId));
  return suffix;
}

const path = require("path");

const appDir = (pathStr = "./") => {
  return path.resolve(`${__dirname}/../app/${pathStr}`);
};

const apiDir = (pathStr = "./") => {
  return path.resolve(`${__dirname}/../api/${pathStr}`);
};

export { appDir, apiDir };
