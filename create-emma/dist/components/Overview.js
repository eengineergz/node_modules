"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
class Overview extends react_1.default.Component {
    render() {
        const { dependencies } = this.props;
        return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
            react_1.default.createElement(ink_1.Color, { green: true, underline: true }, "Selected dependencies:"),
            react_1.default.createElement(ink_1.Box, { flexDirection: "row" },
                dependencies.length === 0 && (react_1.default.createElement(ink_1.Color, { grey: true }, "You haven't selected any dependency yet.")),
                dependencies.map(d => (react_1.default.createElement(ink_1.Box, { key: `dependency-overview-${d.name}`, marginX: 1 },
                    react_1.default.createElement(ink_1.Text, { italic: true, bold: true }, d.name)))))));
    }
}
exports.default = Overview;
