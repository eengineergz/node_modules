import React from 'react';
import { Response } from 'algoliasearch';
export interface IStarter {
    objectID: string;
    owner: string;
    repo: string;
    name: string;
    description?: string;
    signature: string;
    dependencies: IStarterDependency[];
}
export interface IStarterDependency {
    name: string;
}
export interface IStarterDependencyFacet {
    value: string;
    count: number;
}
/**
 * Performs starters search based on provided dependencies.
 * @param dependencies
 */
export declare function searchStarters(query: string, dependencies: IStarterDependency[], page?: number, state?: string): Promise<Response<IStarter> & {
    state: string;
}>;
/**
 *
 * Performs a facet search on starters' dependencies.
 *
 * @param query
 * @param dependencies
 */
export declare function searchDependencies(query: string, dependencies: IStarterDependency[]): Promise<IStarterDependencyFacet[]>;
export declare type WithSearchContext<X> = X & {
    starters: IStarter[];
    facets: IStarterDependencyFacet[];
};
export declare const SearchContext: React.Context<{
    starters: IStarter[];
    facets: IStarterDependencyFacet[];
}>;
//# sourceMappingURL=algolia.d.ts.map