"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const algoliasearch_1 = __importDefault(require("algoliasearch"));
/* Config */
const algolia = {
    appId: 'M0TXMKQA8U',
    apiKey: 'a73f705885dd5341ab59e7a7c8e3d870',
};
const client = algoliasearch_1.default(algolia.appId, algolia.apiKey);
const startersIndex = client.initIndex('prod_STARTERS');
/**
 * Performs starters search based on provided dependencies.
 * @param dependencies
 */
async function searchStarters(query, dependencies, page = 0, state = '') {
    const filters = dependencies
        .map(dependency => `dependencies:${dependency.name}`)
        .join(' AND ');
    const res = await startersIndex.search({
        query: query,
        filters: filters,
        page: page,
        hitsPerPage: 10,
    });
    return Object.assign(Object.assign({}, res), { state });
}
exports.searchStarters = searchStarters;
/**
 *
 * Performs a facet search on starters' dependencies.
 *
 * @param query
 * @param dependencies
 */
async function searchDependencies(query, dependencies) {
    const filters = dependencies
        .map(dependency => `dependencies:${dependency.name}`)
        .join(' AND ');
    const res = await startersIndex.searchForFacetValues({
        facetName: 'dependencies',
        facetQuery: query,
        filters: filters,
    });
    return res.facetHits;
}
exports.searchDependencies = searchDependencies;
exports.SearchContext = react_1.default.createContext({ starters: [], facets: [] });
