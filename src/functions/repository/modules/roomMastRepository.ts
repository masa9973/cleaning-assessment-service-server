import { DynamoDBRepositoryBase } from '@/driver/dynamodb/dynamoDBRepositoryBase';
import { DynamoDBRoomMastRepository } from '@/driver/dynamodb/modules/roomMastRepository';

export const roomMastRepository = new DynamoDBRoomMastRepository(DynamoDBRepositoryBase.MASTER_TABLE_NAME);