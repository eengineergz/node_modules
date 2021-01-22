"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const algoliasearch_1 = __importDefault(require("algoliasearch"));
/* Config */
const algolia = {
    appId: 'OFCNCOG2CU',
    apiKey: '6fe4476ee5a1832882e326b506d14126',
    indexName: 'npm-search',
};
const client = algoliasearch_1.default(algolia.appId, algolia.apiKey).initIndex(algolia.indexName);
/**
 *
 * Performs a search for the specified query and returns information
 * displayed in the UI.
 *
 * @param query
 * @param limit
 */
exports.search = (query, page = 0) => __awaiter(this, void 0, void 0, function* () {
    const res = yield client.search({
        query,
        attributesToRetrieve: [
            'name',
            'version',
            'description',
            'owner',
            'repository',
            'humanDownloadsLast30Days',
        ],
        page: page,
        hitsPerPage: 10,
    });
    return res;
});
exports.SearchContext = react_1.default.createContext([]);
//# sourceMappingURL=algolia.js.map