
- resolve directory
- newest way (may not work in all cases)
```ts
function resolvePath(path:string = "") {
	return `${import.meta.dirname}/${path}`
}
```

- second newest way (works if esm works)
```ts
/** UTILS */
const appDir = new URL('./app/', import.meta.url);

function resolveApp(path = '') {
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
