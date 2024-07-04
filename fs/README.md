- resolve directory
- newest way (may not work in all cases)

```ts
function resolvePath(path: string = "") {
  return `${import.meta.dirname}/${path}`;
}
```

- second newest way (works if esm works)

```ts
/** UTILS */
import { fileURLToPath } from "node:url";

const appDir = new URL("./app/", import.meta.url);

function resolveApp(path = "") {
  return fileURLToPath(new URL(path, appDir));
}

const reactComponentRegex = /\.jsx$/;
```

- old way (cjs)

```ts
const path = require("path");

const cjsDir = (pathStr = "./") => {
  return path.resolve(__dirname, pathStr);
};

export { cjsDir };
```

- another way

```ts
const path = require("path");

const appDir = (pathStr = "./") => {
  return path.resolve(`${__dirname}/../app/${pathStr}`);
};

const apiDir = (pathStr = "./") => {
  return path.resolve(`${__dirname}/../api/${pathStr}`);
};

export { appDir, apiDir };
```


```ts

import { exec } from "child_process";
import { join, dirname } from "path";
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function metaPath(path = "") {
  return join(__dirname, path);
}

(async () => {
  const cdkOutputsFile = join(__dirname, `tmp.${Math.ceil(Math.random() * 10 ** 10)}.json`);
  const configEnv = metaPath("../frontend/.env");
  const infraPath = metaPath("../infra");

  if (!existsSync(infraPath)) {
    console.error(`Infrastructure directory not found: ${infraPath}`);
    process.exit(1);
  }

  try {
    const execProcess = exec(
      `pnpm --prefix "${infraPath}" cdk deploy --outputs-file "${cdkOutputsFile}"`
    );
    execProcess.stdout.pipe(process.stdout);
    execProcess.stderr.pipe(process.stderr);
    await new Promise((resolve, reject) => {
      execProcess.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`CDK deploy failed with code ${code}`)));
    });
  } catch (error) {
    console.error(`CDK command failed: ${error}`);
    process.exit(1);
  }

  // Populate frontend config with data from outputsFile
  try {
    const cdkOutput = JSON.parse(readFileSync(cdkOutputsFile, 'utf-8'))["aws-sdk-js-notes-app"];
    const config = {
      VITE_FILES_BUCKET: cdkOutput.FilesBucket,
      VITE_GATEWAY_URL: cdkOutput.GatewayUrl,
      VITE_IDENTITY_POOL_ID: cdkOutput.IdentityPoolId,
      VITE_REGION: cdkOutput.Region,
    };
    writeFileSync(
      configEnv,
      Object.entries(config)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n")
    );
    console.log("Frontend config updated successfully.");
  } catch (error) {
    console.error(`Error while updating .env: ${error}`);
  }

  // Clean up temporary file
  try {
    if (existsSync(cdkOutputsFile)) {
      unlinkSync(cdkOutputsFile);
      console.log("Temporary file deleted successfully.");
    }
  } catch (error) {
    console.error("Error while deleting temporary file:", error);
  }
})();
```


- delete all js files
```sh
find . -type f -name "*.js" -delete
```