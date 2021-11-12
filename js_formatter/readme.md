A regolith filter for formatting JavaScript files

## Settings

| Setting             | Type     | Default                                 | Description                                                     |
| ------------------- | -------- | --------------------------------------- | --------------------------------------------------------------- |
| `singleLine`        | boolean  | false                                   | Specifies whether JavaScript should be formatted into one line  |
| `enforceJSImports`  | boolean  | false                                   | Specifies whether .js should be added to imports if not found   |
| `enforceExceptions` | boolean  | ["mojang-minecraft", "mojang-gametest"] | Specifies what imports should be ignored during .js enforcement |
| `scriptPaths`       | string[] | ["BP/**/*.js"]                          | Specifies which paths should be effected by the filter          |
