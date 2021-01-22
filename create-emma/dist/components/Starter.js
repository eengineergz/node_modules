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
const ENTER = '\r';
const ARROW_LEFT = '\u001B[D';
const ARROW_RIGHT = '\u001B[C';
/* Package */
class Starter extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            showDetails: false,
        };
        this.handleInput = (data) => {
            const { active, onSubmit, starter } = this.props;
            const char = String(data);
            if (!active)
                return;
            switch (char) {
                case ARROW_RIGHT: {
                    return this.setState({ showDetails: true });
                }
                case ARROW_LEFT: {
                    return this.setState({ showDetails: false });
                }
                case ENTER: {
                    if (onSubmit)
                        return onSubmit(starter);
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
    }
    /**
     *
     * Removes details view when not active anymore.
     *
     * @param props
     * @param state
     */
    static getDerivedStateFromProps(props, state) {
        if (props.active === false)
            return Object.assign(Object.assign({}, state), { showDetails: false });
        return null;
    }
    render() {
        const { starter, active } = this.props;
        const { showDetails } = this.state;
        const Cursor = () => (react_1.default.createElement(ink_1.Box, { marginRight: 1 }, (() => {
            if (active) {
                return react_1.default.createElement(ink_1.Color, { magenta: true }, `›`);
            }
            else {
                return react_1.default.createElement(ink_1.Text, null, ` `);
            }
        })()));
        const OwnerRepo = () => (react_1.default.createElement(ink_1.Box, { width: this.getColumnWidth('owner.repo'), marginRight: 1 },
            react_1.default.createElement(ink_1.Text, { bold: true }, `${starter.owner}/${starter.repo}`)));
        const Name = () => (react_1.default.createElement(ink_1.Box, { width: this.getColumnWidth('name'), marginRight: 1 },
            react_1.default.createElement(ink_1.Text, { italic: true }, starter.name)));
        const Description = () => (react_1.default.createElement(ink_1.Box, { flexDirection: "row", marginX: 2 },
            react_1.default.createElement(ink_1.Text, null, starter.description)));
        if (showDetails) {
            return (react_1.default.createElement(ink_1.Box, { flexDirection: "column", marginY: 1 },
                react_1.default.createElement(ink_1.Box, { flexDirection: "row" },
                    react_1.default.createElement(Cursor, null),
                    react_1.default.createElement(OwnerRepo, null),
                    react_1.default.createElement(Name, null)),
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(Description, null))));
        }
        return (react_1.default.createElement(ink_1.Box, { flexDirection: "row", marginY: 0, marginX: 0 },
            react_1.default.createElement(Cursor, null),
            react_1.default.createElement(OwnerRepo, null),
            react_1.default.createElement(Name, null)));
    }
    /**
     *
     * Calculates the width of each column in the list.
     *
     * @param column
     */
    getColumnWidth(column) {
        const hits = this.props.starters
            .map(hit => {
            switch (column) {
                case 'owner.repo': {
                    return `${hit.owner}/${hit.repo}`;
                }
                case 'name': {
                    return hit.name;
                }
                default: {
                    return hit[column];
                }
            }
        })
            .map(c => c.length);
        return Math.max(...hits);
    }
}
class StarterWithStdinAndHits extends react_1.default.Component {
    render() {
        return (react_1.default.createElement(algolia_1.SearchContext.Consumer, null, ({ starters, facets }) => (react_1.default.createElement(ink_1.StdinContext.Consumer, null, ({ stdin, setRawMode }) => (react_1.default.createElement(Starter, Object.assign({}, this.props, { stdin: stdin, setRawMode: setRawMode, starters: starters, facets: facets })))))));
    }
}
exports.default = StarterWithStdinAndHits;
