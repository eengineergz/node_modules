"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const cli_truncate_1 = __importDefault(require("cli-truncate"));
const string_width_1 = __importDefault(require("string-width"));
const defaultChars = {
    topLeft: '┌',
    topRight: '┐',
    bottomRight: '┘',
    bottomLeft: '└',
    vertical: '│',
    horizontal: '─',
};
function drawBox({ title, width, height, str, drawExtension, }) {
    const chars = Object.assign({}, defaultChars);
    if (drawExtension) {
        chars.topLeft = '├';
        chars.topRight = '┤';
    }
    title = title || '';
    const topLine = chalk_1.default.grey(chars.topLeft + chars.horizontal) +
        (title ? ' ' : '') +
        chalk_1.default.reset(title) +
        (title ? ' ' : '') +
        chalk_1.default.grey(chars.horizontal.repeat(width - string_width_1.default(title) - (title ? 2 : 0) - 3) + chars.topRight) +
        chalk_1.default.reset();
    const bottomLine = chars.bottomLeft + chars.horizontal.repeat(width - 2) + chars.bottomRight;
    const lines = str.split('\n');
    if (lines.length < height) {
        lines.push(...new Array(height - lines.length).fill(''));
    }
    const mappedLines = lines
        .slice(-height)
        .map(l => {
        const lineWidth = Math.min(string_width_1.default(l || ''), width);
        const paddingRight = Math.max(width - lineWidth - 2, 0);
        return `${chalk_1.default.grey(chars.vertical)}${chalk_1.default.reset(cli_truncate_1.default(l, width - 2))}${' '.repeat(paddingRight)}${chalk_1.default.grey(chars.vertical)}`;
    })
        .join('\n');
    return chalk_1.default.grey(topLine + '\n' + mappedLines + '\n' + bottomLine);
}
exports.drawBox = drawBox;
