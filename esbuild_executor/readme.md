A regolith filter for using esbuild

## Settings

| Setting        | Type                                                     | Default                                | Description                                                         |
| -------------- | -------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| `buildOptions` | [buildOptions](https://esbuild.github.io/api/#build-api) | [defBuildOpts](#default-build-options) | Specifies build options for esbuild                                 |
| `ignoreGlob`   | string[]                                                 | []                                     | Ignores files matching the glob paths during removal after building |
| `removeGlob`   | string                                                   | ""                                     | Removes all files matching the glob path after building             |

#### Default Build Options

```js
{
  external: ["mojang-minecraft", "mojang-minecraft-ui", "mojang-gametest"],
  entryPoints: ["BP/src/index.ts"],
  outfile: "BP/scripts/index.js",
  target: "es2020",
  format: "esm",
  bundle: true,
  minify: true
}
```
