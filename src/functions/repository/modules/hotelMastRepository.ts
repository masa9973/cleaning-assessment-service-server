import { DynamoDBRepositoryBase } from '@/driver/dynamodb/dynamoDBRepositoryBase';
import { DynamoDBHotelMastRepository } from '@/driver/dynamodb/modules/recordMastRepository';

export const hotelMastRepository = new DynamoDBHotelMastRepository(DynamoDBRepositoryBase.MASTER_TABLE_NAME);