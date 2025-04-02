import * as Errors from '../errors';
import { logger } from '../server/logger';

export class CMSClient {
    private projectId: string;
    private dataset: string;
    private useCdn: boolean;
    private apiVersion: string;

    constructor(options?) {
        const { projectId, dataset, useCdn, apiVersion } = options || {};

        if (projectId && dataset && useCdn && apiVersion) {
            this.projectId = projectId;
            this.dataset = dataset;
            this.useCdn = useCdn;
            this.apiVersion = apiVersion;
        } else {
            logger.debug('Initializing CMS client directly from env vars');
            const { SANITY_PROJECT_ID, SANITY_DATASET } = process.env;

            if (!SANITY_PROJECT_ID || !SANITY_DATASET) throw new Errors.LoadedError(Errors.Code.CMS_CONFIG_MISSING);

            this.projectId = SANITY_PROJECT_ID;
            this.dataset = SANITY_DATASET;
            this.useCdn = true;
            this.apiVersion = '1';
        }
    }
}
