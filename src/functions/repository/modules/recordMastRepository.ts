import { DynamoDBRepositoryBase } from '@/driver/dynamodb/dynamoDBRepositoryBase';
import { DynamoDBRecordMastRepository } from '@/driver/dynamodb/modules/recordMastRepository';

export const recordMastRepository = new DynamoDBRecordMastRepository(DynamoDBRepositoryBase.MASTER_TABLE_NAME);