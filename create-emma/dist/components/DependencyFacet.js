"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const ink_1 = require("ink");
const algolia_1 = require("../algolia");
const SPACE = ' ';
/* Package */
class DependencyFacet extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.handleInput = (data) => {
            const { active, onClick, dependency } = this.props;
            const char = String(data);
            if (!active)
                return;
            switch (char) {
                case SPACE: {
                    return onClick(dependency);
                }
            }
        };
    }
    componentDidMount() {
        const { stdin, setRawMode } = this.props;
        if (setRawMode)
            setRawMode(true);
        stdin.on('data', this.handleInput);
    }
    componentWillUnmount() {
        const { stdin } = this.props;
        stdin.removeListener('data', this.handleInput);
        // if (setRawMode) setRawMode(false)
    }
    render() {
        const { dependency, active, selected } = this.props;
        const Cursor = () => (react_1.default.createElement(ink_1.Box, { marginRight: 1 }, (() => {
            if (selected) {
                if (active)
                    return react_1.default.createElement(ink_1.Color, { magenta: true }, `›`);
                else
                    return react_1.default.createElement(ink_1.Text, null, `-`);
            }
            else {
                if (active)
                    return react_1.default.createElement(ink_1.Color, { cyan: true }, `›`);
                else
                    return react_1.default.createElement(ink_1.Text, null, ` `);
            }
        })()));
        const Count = () => (react_1.default.createElement(ink_1.Box, { width: this.getColumnWidth('count'), marginRight: 1 },
            react_1.default.createElement(ink_1.Text, null, dependency.count)));
        const Name = () => (react_1.default.createElement(ink_1.Box, { width: this.getColumnWidth('value') },
            react_1.default.createElement(ink_1.Text, { bold: true, italic: true }, dependency.value)));
        return (react_1.default.createElement(ink_1.Box, { flexDirection: "row", marginY: 0, marginX: 0 },
            react_1.default.createElement(Cursor, null),
            react_1.default.createElement(Count, null),
            react_1.default.createElement(Name, null)));
    }
    /**
     *
     * Calculates the width of each column in the list.
     *
     * @param column
     */
    getColumnWidth(column) {
        const hits = this.props.facets
            .map(hit => {
            switch (column) {
                case 'count': {
                    return `${hit.count}`;
                }
                case 'value': {
                    return hit.value;
                }
            }
        })
            .map(c => c.length);
        return Math.max(...hits);
    }
}
class DependencyFacetWithStdinAndStartersAndFacets extends react_1.default.Component {
    render() {
        return (react_1.default.createElement(algolia_1.SearchContext.Consumer, null, ({ starters, facets }) => (react_1.default.createElement(ink_1.StdinContext.Consumer, null, ({ stdin, setRawMode }) => (react_1.default.createElement(DependencyFacet, Object.assign({}, this.props, { stdin: stdin, setRawMode: setRawMode, starters: starters, facets: facets })))))));
    }
}
exports.default = DependencyFacetWithStdinAndStartersAndFacets;
