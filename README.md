# Carthage Bootstrap

This action is an easy to use wrapper around `carthage bootstrap`. You can use it for iOS, tvOS, macOS and watchOS projects.

## Basic Usage

The action currently only supports downloading of dependencies through the GitHub API. For this, the `github-token` input is required, which you can set to the built-in `GITHUB_TOKEN` secret.

Currently supported Carthage options:

`--platform`: if missing, it will build all platforms supported by Carthage. Consult Carthage manual for possible values.

The following flags are also supported:

`--use-xcframeworks`, `--no-use-binaries`, `--verbose`: if missing, they will all default to `false`.

Example usage:

```yaml
  - name: "Carthage Bootstrap"
    uses: ettore/carthage-bootstrap@main
    with:
      github-token: ${{ secrets.GITHUB_TOKEN }}
      platform: iOS
      use-xcframeworks: true
      no-use-binaries: true
      verbose: true
```

## Contributing

### Set-up on macOS

First install node.js from https://nodejs.org/en/download/current/. Then:
```bash
npm install @actions/core
npm install @actions/github
npm install execa
sudo npm i -g @vercel/ncc
```

### Development

After cloning the repo and doing your modifications, compile with:
```bash
npm run prep
```

## History

This is a modified version of the [original carthage-bootstrap action](https://github.com/devbotsxyz/carthage-bootstrap) developed by [devbotsxyz](https://github.com/devbotsxyz). The main differences is that this version does not have any caching whatsoever. I've found caching detrimental in a CI context and I prefer reliability and predictability at the expense of speed. If you need caching, you should look at the original repo.

As a consequence, this action might be simpler to modify and extend for iOS developers like myself that are not very JavaScript savvy.

## License

[MIT](LICENSE) license.
