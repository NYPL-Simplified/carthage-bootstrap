// MIT License - Copyright (c) 2020 Stefan Arentz <stefan@devbots.xyz>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const fs = require('fs');
const core = require('@actions/core');
const execa = require('execa');

const parseConfiguration = () => {
    const configuration = {
      platform: core.getInput("platform"),
      useXCFrameworks: core.getInput("use-xcframeworks"),
      noUseBinaries: core.getInput("no-use-binaries"),
      verbose: core.getInput("verbose"),
      gitHubToken: core.getInput("github-token", {required: true}), // Not required when using SSH?
    };
    return configuration;
};


const carthageBootstrap = async ({platform, useXCFrameworks, noUseBinaries, verbose, gitHubToken}) => {
    let options = [];
    if (platform !== "") {
        options = [...options, "--platform", platform];
    }
    if (useXCFrameworks === "true") {
      options = [...options, "--use-xcframeworks"];
    }
    if (verbose === "true") {
        options = [...options, "--verbose"];
    }
    if (noUseBinaries === "true") {
        options = [...options, "--no-use-binaries"];
    }

    core.info(`Finished computing options ${options}`);

    const carthage = execa("carthage", ["bootstrap", ...options],
                           {reject: false, env: {"NSUnbufferedIO": "YES",
                                                 "GITHUB_ACCESS_TOKEN": gitHubToken}});

    carthage.stdout.pipe(process.stdout);
    carthage.stderr.pipe(process.stderr);

    let {exitCode} = await carthage;
    if (exitCode != 0) {
        throw Error(`Carthage bootstrap failed with exit code ${exitCode}`);
    }
};


const main = async () => {
    // TODO Better to look in PATH
    if (!fs.existsSync("/usr/local/bin/carthage")) {
        core.setFailed(`Cannot find carthage command in /usr/local/bin/carthage.`);
        return;
    }

    if (!fs.existsSync("Cartfile") || !fs.existsSync("Cartfile.resolved")) {
        core.setFailed(`Cannot find Cartfile and Cartfile.resolved in the working directory.`);
        return;
    }

    try {
        const configuration = parseConfiguration();
        await carthageBootstrap(configuration);
    } catch (error) {
        core.setFailed(`Carthage bootstrap failed with an unexpected error: ${error.message}`);
    }
};


main();
