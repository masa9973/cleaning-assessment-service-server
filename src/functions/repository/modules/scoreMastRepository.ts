import { DynamoDBRepositoryBase } from '@/driver/dynamodb/dynamoDBRepositoryBase';
import { DynamoDBScoreMastRepository } from '@/driver/dynamodb/modules/scoreMastRepository';

export const scoreMastRepository = new DynamoDBScoreMastRepository(DynamoDBRepositoryBase.MASTER_TABLE_NAME);