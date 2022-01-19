import { DynamoDBRepositoryBase } from '@/driver/dynamodb/dynamoDBRepositoryBase';
import { DynamoDBRoomMastRepository } from '@/driver/dynamodb/modules/recordMastRepository';

export const hotelMastRepository = new DynamoDBRoomMastRepository(DynamoDBRepositoryBase.MASTER_TABLE_NAME);