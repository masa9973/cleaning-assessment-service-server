import { RepositoryContainer } from 'cleaning-assessment-service-abr';
import { recordMastRepository } from './modules/recordMastRepository';
import { s3Repository } from './modules/s3Repository';
import { userMastRepository } from './modules/userMastRepository';
import { scoreMastRepository } from './modules/scoreMastRepository';
import { hotelMastRepository } from './modules/hotelMastRepository';
import { roomMastRepository } from './modules/roomMastRepository';
import { scoreItemMastRepository } from './modules/scoreItemMastRepository';

export const repositoryContainer = new RepositoryContainer(
    // infra
    hotelMastRepository,
    s3Repository,
    // resources
    userMastRepository,
    recordMastRepository,
    scoreMastRepository,
    roomMastRepository,
    scoreItemMastRepository
);