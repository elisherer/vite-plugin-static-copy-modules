# vite-static-copy-modules


# Installation

`npm i -D vite-plugin-static-copy-modules`

# Example use

```typescript
import { viteStaticCopyModulePlugin } from "vite-plugin-static-copy-modules";
//...
    plugins: [
//...
        viteStaticCopyModulePlugin([
          {
            moduleName: "monaco-editor",
            define: "import.meta.env.MONACO_PATH",
            targets: (modulePath, publicPath) => [
              {
                src: path.resolve(modulePath, "min"),
                dest: publicPath,
              },
              {
                src: path.resolve(modulePath, "min-maps"),
                dest: publicPath,
              },
            ],
          },
          {
            moduleName: "mermaid",
            define: "import.meta.env.MERMAID_PATH",
            targets: (modulePath, publicPath) => [
              {
                src: path.resolve(modulePath, "dist", "*.{js,mjs}"),
                dest: publicPath,
              },
            ],
          },
        ]),
//...
    ]
// ...
```

## Monaco example
Later in code, (using `@monaco-editor/loader`/`@monaco-editor/react`) write:
```typescript
loader.config({
  paths: {
    vs: `/${import.meta.env.MONACO_PATH}/min/vs`,
  },
});
```

# License
[MIT](./LICENSE)