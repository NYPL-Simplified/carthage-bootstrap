# Carthage Bootstrap

This action is an easy to use wrapper around `carthage bootstrap`. You can use it for iOS, tvOS, macOS and watchOS projects.

### Automatic Caching

One notable feature of this Action is that by default it will cache the `Carthage` directory using the GitHub provided caching infrastructure. This will considerably speed up builds. The `./Carthage` directory is cached in such a way that it can be used by any branch (and thus pull requests) that uses the same `Cartfile.resolved` and Xcode version.

## Basic Usage

The action currently only supports downloading of dependencies through the GitHub API. For this, the `github-token` input is required, which you can set to the built-in `GITHUB_TOKEN` secret.

```yaml
- name: "Carthage Bootstrap"
  uses: ettore/carthage-bootstrap@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Example Workflow for a macOS application

```yaml
name: Test

on:
  push:
    branches:
      - main

jobs:
  Test:
    runs-on: macos-10.15
    timeout-minutes: 10
    steps:
      - name: "Checkout Project"
        uses: actions/checkout@v2

      - name: "Carthage Bootstrap"
        uses: ettore/carthage-bootstrap@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          platform: macOS
          use-xcframeworks: true

```

## License and Contributions

This Action is licensed under the [MIT](LICENSE) license. Contributions are very much welcome and encouraged but we would like to ask to file an issue before submitting pull requests.
