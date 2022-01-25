import { DynamoDBRepositoryBase } from '@/driver/dynamodb/dynamoDBRepositoryBase';
import { DynamoDBScoreItemMastRepository } from '@/driver/dynamodb/modules/scoreItemMastRepository';

export const scoreItemMastRepository = new DynamoDBScoreItemMastRepository(DynamoDBRepositoryBase.MASTER_TABLE_NAME);