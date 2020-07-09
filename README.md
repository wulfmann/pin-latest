# pin-latest

Small utility for converting `package.json` versions from `latest` to the actual latest version.

## Quickstart

Install

```bash
npm i -g pin-latest
# or
yarn global add pin-latest
# or
npx pin-latest
```

Given the following `package.json`:

```json
{
    "name": "example-project",
    "dependencies": {
        "react": "latest"
    }
}
```

Running `pin-latest` will result in the following output:

```bash
$ pin-latest .

{
    "name": "example-project",
    "dependencies": {
        "react": "^16.13.1"
    }
}
```

To save changes pass the `--write` flag:

```bash
$ pin-latest .
package.json updated.

$ cat package.json
{
    "name": "example-project",
    "dependencies": {
        "react": "^16.13.1"
    }
}
```

## Reference

```text
$ pin-latest --help

Usage
    $ pin-latest <project-directory>
Options
    --exact, -t     Set the exact version
    --write, -w     Write changes
    --version, -v   Version number
    --help, -h      Displays this message
    --debug, -d     Enable verbose logging
```

### Exact

The `--exact` flag modifies the behavior of the version that is written.

If `--exact` is passed, the version will be written without a leading `^`.

Example:

```bash
$ pin-latest .
{
    "react": "^1.0.0"
}

$ pin-latest --exact .
{
    "react": "1.0.0"
}
```

### Write

The `--write` flag decides whether or not changes should be written to disk. If `--write` is not passed, the modified file is sent to `stdout`.
