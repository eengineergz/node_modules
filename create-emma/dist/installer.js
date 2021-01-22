"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prompts_1 = __importDefault(require("prompts"));
const EMMA_CLI_URL = 'https://emma-cli.herokuapp.com/api/';
/**
 * Loads the starter template from EmmaCLI DB.
 * @param starter
 */
async function getStarterTemplateRepo(starter) {
    try {
        const res = await node_fetch_1.default(`${EMMA_CLI_URL}/starters/${starter.objectID}`).then(res => res.json());
        return [
            null,
            {
                uri: `https://github.com/${res.owner}/${res.repo}`,
                branch: res.ref,
                path: res.path,
            },
        ];
    }
    catch (err) {
        return [err.message];
    }
}
exports.getStarterTemplateRepo = getStarterTemplateRepo;
/**
 * Prompts for the destination directory.
 *
 * @param provided
 */
async function getDistDirectory(cwd, provided) {
    if (provided) {
        const conflicts = checkFolderForConflicts(provided);
        if (conflicts.length > 0) {
            return [`Selected directory is not empty.`];
        }
        return [null, provided];
    }
    else {
        const destination = await prompts_1.default({
            type: 'text',
            name: 'path',
            message: 'Where should I load the starter?',
            initial: 'my-app',
            validate: dist => {
                const conflicts = checkFolderForConflicts(path_1.default.resolve(cwd, dist));
                if (conflicts.length > 0) {
                    return `Selected directory is not empty.`;
                }
                return true;
            },
        });
        return [null, destination.path];
    }
}
exports.getDistDirectory = getDistDirectory;
/**
 * Determines whether a folder includes any conflicts.
 * @param cwd
 */
function checkFolderForConflicts(cwd) {
    const exists = fs_1.default.existsSync(cwd);
    if (!exists)
        return [];
    /* taken from zeit/next.js/create-next-app */
    const validFiles = [
        '.DS_Store',
        '.git',
        '.gitattributes',
        '.gitignore',
        '.gitlab-ci.yml',
        '.hg',
        '.hgcheck',
        '.hgignore',
        '.idea',
        '.npmignore',
        '.travis.yml',
        'LICENSE',
        'Thumbs.db',
        'docs',
        'mkdocs.yml',
        'npm-debug.log',
        'yarn-debug.log',
        'yarn-error.log',
    ];
    const conflicts = fs_1.default
        .readdirSync(cwd)
        .filter(file => !validFiles.includes(file))
        // Support IntelliJ IDEA-based editors
        .filter(file => !/\.iml$/.test(file));
    return conflicts;
}
