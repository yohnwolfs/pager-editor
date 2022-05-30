import { createRemoteComponent } from './createRemoteComponent';
import { createRequires } from './createRequires';
import { getDependencies } from './getDependencies';

const requires = createRequires(getDependencies);

export interface RemoteComponentProps {}

/**
 * 远程组件
 * @param props
 * @returns
 */
export const RemoteComponent = createRemoteComponent({ requires });
