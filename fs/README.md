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
