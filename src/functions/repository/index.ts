import { RepositoryContainer } from 'stage3-abr';
import { recordMastRepository } from './modules/recordMastRepository';
import { s3Repository } from './modules/s3Repository';
import { userMastRepository } from './modules/userMastRepository';
import { scoreMastRepository } from './modules/scoreMastRepository';

export const repositoryContainer = new RepositoryContainer(
    // infra
    s3Repository,
    // resources
    userMastRepository,
    recordMastRepository,
    scoreMastRepository,
);