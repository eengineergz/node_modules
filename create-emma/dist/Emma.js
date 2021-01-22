"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const algolia_1 = require("./algolia");
const DependencyFacet_1 = __importDefault(require("./components/DependencyFacet"));
const Footer_1 = __importDefault(require("./components/Footer"));
const Overview_1 = __importDefault(require("./components/Overview"));
const Starter_1 = __importDefault(require("./components/Starter"));
const Scroll_1 = __importDefault(require("./components/Scroll"));
const Search_1 = __importDefault(require("./components/Search"));
const ENTER = '\r';
const CTRL_C = '\x03';
class Emma extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 'DEPENDENCIES_SEARCH',
            query: '',
            facets: [],
            loading: false,
            dependencies: [],
            starters: [],
        };
        this.handleQueryChange = this.handleQueryChange.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleWillReachEnd = this.handleWillReachEnd.bind(this);
        this.handleDependencyToggle = this.handleDependencyToggle.bind(this);
    }
    componentDidMount() {
        const { stdin, setRawMode } = this.props;
        if (setRawMode)
            setRawMode(true);
        stdin.setMaxListeners(100);
        stdin.on('data', this.handleInput);
    }
    componentWillUnmount() {
        const { stdin, setRawMode } = this.props;
        stdin.removeListener('data', this.handleInput);
        if (setRawMode)
            setRawMode(false);
    }
    /**
     * Keyboard events manager split based on the active view.
     */
    async handleInput(data) {
        const s = String(data);
        /**
         * Create an exit listener.
         */
        if (s === CTRL_C) {
            process.exit(0);
        }
        switch (this.state.view) {
            case 'DEPENDENCIES_SEARCH': {
                if (s === ENTER) {
                    const { starters, dependencies } = this.state;
                    this.setState({
                        view: 'STARTERS_SEARCH',
                        query: '',
                        page: 0,
                        loading: false,
                        starters: starters,
                        dependencies: dependencies,
                    });
                }
                return;
            }
        }
    }
    /**
     * Whenever input changes, switch to the initial screen, change the value
     * of the query accordingly, reset pagination and perform search.
     */
    async handleQueryChange(query) {
        switch (this.state.view) {
            case 'DEPENDENCIES_SEARCH': {
                this.setState({
                    view: 'DEPENDENCIES_SEARCH',
                    query: query,
                    loading: true,
                });
                const [starters, facets] = await Promise.all([
                    algolia_1.searchStarters('', this.state.dependencies, 0, query),
                    algolia_1.searchDependencies(query, this.state.dependencies),
                ]);
                if (this.state.view === 'DEPENDENCIES_SEARCH' &&
                    starters.state === this.state.query) {
                    this.setState({
                        view: 'DEPENDENCIES_SEARCH',
                        query: query,
                        facets: facets,
                        loading: false,
                        dependencies: this.state.dependencies,
                        starters: starters.hits,
                    });
                }
                return;
            }
            case 'STARTERS_SEARCH': {
                this.setState({
                    view: 'STARTERS_SEARCH',
                    query: query,
                    page: 0,
                    dependencies: this.state.dependencies,
                    starters: this.state.starters,
                    loading: true,
                });
                const starters = await algolia_1.searchStarters(query, this.state.dependencies);
                if (starters.query === this.state.query &&
                    this.state.view === 'STARTERS_SEARCH') {
                    this.setState({
                        view: 'STARTERS_SEARCH',
                        loading: false,
                        starters: starters.hits,
                        dependencies: this.state.dependencies,
                    });
                }
            }
        }
    }
    /**
     * Start querying new hits and update pagination. But limit pagniation to
     * ten pages.
     */
    async handleWillReachEnd() {
        switch (this.state.view) {
            case 'STARTERS_SEARCH': {
                const { query, starters, dependencies, page } = this.state;
                /* Memory leak. */
                if (page > 10)
                    return;
                /* Perform search of the next page. */
                const res = await algolia_1.searchStarters(query, dependencies, page + 1);
                if (res.query === this.state.query &&
                    this.state.view === 'STARTERS_SEARCH' &&
                    res.page - 1 === this.state.page) {
                    this.setState({
                        view: 'STARTERS_SEARCH',
                        page: res.page,
                        starters: [...starters, ...res.hits],
                        dependencies: [],
                        query: query,
                        loading: false,
                    });
                }
            }
        }
    }
    /**
     * Creates a new dependency if newly selected or toggles the existing one.
     */
    async handleDependencyToggle({ value }) {
        switch (this.state.view) {
            case 'DEPENDENCIES_SEARCH': {
                const { dependencies } = this.state;
                /* Search to see whether the dependency is already selected. */
                const foundDependency = dependencies.find(({ name }) => name === value);
                /* Add/Remove dependency from the list. */
                if (foundDependency === undefined) {
                    this.setState({
                        view: 'DEPENDENCIES_SEARCH',
                        dependencies: [...dependencies, { name: value }],
                    });
                }
                else {
                    this.setState({
                        view: 'DEPENDENCIES_SEARCH',
                        dependencies: dependencies.filter(({ name }) => name !== value),
                    });
                }
                /* Perform search. */
                const [starters, facets] = await Promise.all([
                    algolia_1.searchStarters('', this.state.dependencies),
                    algolia_1.searchDependencies('', this.state.dependencies),
                ]);
                if (this.state.view === 'DEPENDENCIES_SEARCH') {
                    this.setState({
                        view: 'DEPENDENCIES_SEARCH',
                        query: this.state.query,
                        facets: facets,
                        loading: false,
                        dependencies: this.state.dependencies,
                        starters: starters.hits,
                    });
                }
            }
        }
    }
    render() {
        switch (this.state.view) {
            case 'DEPENDENCIES_SEARCH': {
                const { query, loading, starters, facets, dependencies } = this.state;
                return (react_1.default.createElement(algolia_1.SearchContext.Provider, { value: { starters, facets } },
                    react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
                        react_1.default.createElement(Search_1.default, { heading: react_1.default.createElement(ink_1.Text, { underline: true }, "Search tools:"), value: query, onChange: this.handleQueryChange, loading: loading, active: true }),
                        react_1.default.createElement(Overview_1.default, { dependencies: this.state.dependencies }),
                        react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
                            react_1.default.createElement(ink_1.Color, { cyan: true, underline: true }, "Search:"),
                            react_1.default.createElement(Scroll_1.default, { placeholder: "Packages will appear as you start searching!", values: this.state.facets, active: true }, dependency => (react_1.default.createElement(DependencyFacet_1.default, { key: `${query}-dependency-${dependency.value}`, dependency: dependency, onClick: this.handleDependencyToggle, selected: dependencies.some(d => d.name === dependency.value), active: dependency.active })))),
                        react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
                            react_1.default.createElement(ink_1.Text, null, "Starters:"),
                            react_1.default.createElement(Scroll_1.default, { placeholder: "", values: this.state.starters, active: false }, starter => (react_1.default.createElement(Starter_1.default, { key: starter.objectID, starter: starter, active: false })))),
                        react_1.default.createElement(Footer_1.default, null))));
            }
            case 'STARTERS_SEARCH': {
                const { query, loading, starters } = this.state;
                return (react_1.default.createElement(algolia_1.SearchContext.Provider, { value: { starters, facets: [] } },
                    react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
                        react_1.default.createElement(Overview_1.default, { dependencies: this.state.dependencies }),
                        react_1.default.createElement(Search_1.default, { heading: react_1.default.createElement(ink_1.Color, { yellow: true, underline: true }, "Search starters:"), value: query, onChange: this.handleQueryChange, loading: loading, active: true }),
                        react_1.default.createElement(Scroll_1.default, { placeholder: "We couldn't find anything. Try changing the search!", values: this.state.starters, onWillReachEnd: this.handleWillReachEnd, active: true }, starter => (react_1.default.createElement(Starter_1.default, { key: starter.objectID, starter: starter, onSubmit: this.props.onSelect, active: starter.active }))),
                        react_1.default.createElement(Footer_1.default, null))));
            }
        }
    }
}
class EmmaWithStdin extends react_1.default.Component {
    render() {
        return (react_1.default.createElement(ink_1.StdinContext.Consumer, null, ({ stdin, setRawMode }) => (react_1.default.createElement(Emma, Object.assign({}, this.props, { stdin: stdin, setRawMode: setRawMode })))));
    }
}
exports.default = EmmaWithStdin;
