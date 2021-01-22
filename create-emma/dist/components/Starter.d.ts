import React from 'react';
import { IStarter } from '../algolia';
interface Props {
    starter: IStarter;
    active: boolean;
    onSubmit?: (starter: IStarter) => void;
}
export default class StarterWithStdinAndHits extends React.Component<Props> {
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=Starter.d.ts.map