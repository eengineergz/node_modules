import React from 'react';
import { IStarterDependencyFacet } from '../algolia';
interface Props {
    dependency: IStarterDependencyFacet;
    active: boolean;
    selected: boolean;
    onClick: (dependency: IStarterDependencyFacet) => void;
}
export default class DependencyFacetWithStdinAndStartersAndFacets extends React.Component<Props> {
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=DependencyFacet.d.ts.map