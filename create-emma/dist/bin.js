#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const chalk_1 = __importDefault(require("chalk"));
const creato_1 = require("creato");
const ink_1 = require("ink");
const meow_1 = __importDefault(require("meow"));
const multilines_1 = __importDefault(require("multilines"));
const ora_1 = __importDefault(require("ora"));
const update_notifier_1 = __importDefault(require("update-notifier"));
const prompts_1 = __importDefault(require("prompts"));
const Emma_1 = __importDefault(require("./Emma"));
const installer_1 = require("./installer");
const structure_1 = require("./structure");
const fs_1 = require("fs");
/* Spec */
const cli = meow_1.default(multilines_1.default `
  | Usage
  |  $ create-emma <dir>
  `);
/**
 * Make sure that user is on the latest version
 * avaiable in case they have connection to NPM.
 */
const notifier = update_notifier_1.default(cli);
notifier.notify();
if (notifier.update) {
    process.exit(0);
}
/* Main */
// function breakStep() {
//   console.log(`-------------------------------------------------------`)
// }
async function main(cwd) {
    console.log(structure_1.drawBox({
        title: `Welcome to ${chalk_1.default.bold.blue(`emma-cli starters`)}!`,
        width: 60,
        height: 4,
        str: multilines_1.default `
      | I'll help you find the starter for your project! 
      |
      | We'll start by finding the appropriate folder for your
      | project, and then explore the starters you can use.
      `,
    }));
    /* Destination picker */
    const [err, dist] = await installer_1.getDistDirectory(cwd, cli.input[0]);
    if (err || !dist)
        return console.error(err);
    await prompts_1.default({
        type: 'confirm',
        name: 'openBrowser',
        message: multilines_1.default `
      | I'll now open a browser of starters so you can find the one you need.

      `,
    });
    console.log(structure_1.drawBox({
        title: `Browsing Instructions`,
        width: 60,
        height: 6,
        str: multilines_1.default `
      | You can start typing to search the tools used in strarters.
      |
      | Press ${chalk_1.default.yellow('space')} to select the tools,
      | and ${chalk_1.default.yellow('enter')} to move forward in the process.
      |
      | You can search both, the dependencies and the starters.
      `,
    }));
    /* Starter browser. */
    let app;
    const handleStarterSelect = async (starter) => {
        /* Unmount browser. */
        app.unmount();
        /* Find and load the tempalte. */
        const [templateError, repo] = await installer_1.getStarterTemplateRepo(starter);
        if (templateError || !repo)
            return console.error(templateError);
        /* Load starter */
        const spinner = ora_1.default({
            text: `Loading ${starter.name} from ${repo.uri} to ${dist}.`,
        });
        /* Creates a dist folder. */
        fs_1.mkdirSync(dist, { recursive: true });
        /* Use creato to load the template. */
        const loadStatus = await creato_1.loadTemplate({
            name: starter.name,
            description: starter.description || '',
            repo: repo,
        }, dist);
        if (loadStatus.status === 'err') {
            spinner.fail();
            console.error(loadStatus.message);
        }
        else {
            spinner.succeed();
            console.log(loadStatus.message);
        }
    };
    app = ink_1.render(react_1.default.createElement(Emma_1.default, { onSelect: handleStarterSelect }), {
        exitOnCtrlC: true,
    });
}
exports.main = main;
try {
    main(process.cwd());
}
catch (err) {
    console.error(err);
    process.exit(1);
}
