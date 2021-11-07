A regolith filter for transpiling Typescript files

## Settings

| Setting           | Type                                                                       | Default      | Description                                                      |
| ----------------- | -------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------- |
| `removeTS`        | boolean                                                                    | false        | Specifies whether to delete typescript files in the build or not |
| `path`            | string                                                                     | "BP/scripts" | Specifies what folder to look for typescript files in            |
| `compilerOptions` | [compilerOptions](https://www.typescriptlang.org/tsconfig#compilerOptions) | {}           | Specifies compiler options for the generated tsconfig.json       |
