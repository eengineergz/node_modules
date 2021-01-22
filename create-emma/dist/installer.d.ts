import { TemplateRepository } from 'creato';
import { IStarter } from './algolia';
/**
 * Loads the starter template from EmmaCLI DB.
 * @param starter
 */
export declare function getStarterTemplateRepo(starter: IStarter): Promise<[string] | [null, TemplateRepository]>;
/**
 * Prompts for the destination directory.
 *
 * @param provided
 */
export declare function getDistDirectory(cwd: string, provided?: string): Promise<[string] | [null, string]>;
//# sourceMappingURL=installer.d.ts.map