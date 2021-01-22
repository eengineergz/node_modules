"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(require("os"));
function ml(template, ...args) {
    /* Compiles template string literal */
    const string = String.raw(template, ...args);
    const lines = string.split(os.EOL);
    /* Strips lines */
    const compiledLines = lines.reduce((acc, line, i) => {
        if (i === 0 && line.trim() === '') {
            /* Empty first line */
            return [];
        }
        else if (i === lines.length - 1 && line.trim() === '') {
            /* Empty last line */
            return acc;
        }
        else {
            /* Parse lines in between */
            return [...acc, line.replace(/^(\s*\|(\s|))/, '')];
        }
    }, []);
    const compiledString = compiledLines.join(os.EOL);
    return compiledString;
}
exports.ml = ml;
exports.default = ml;
//# sourceMappingURL=index.js.map