import { DynamoDBRepositoryBase } from '@/driver/dynamodb/dynamoDBRepositoryBase';
import { DynamoDBRecordMastRepository } from '@/driver/dynamodb/modules/recordMastRepository';
import { RecordMastRepositoryCacheAdaptor } from 'cleaning-assessment-service-abr'

export const recordMastRepository = new RecordMastRepositoryCacheAdaptor(
    new DynamoDBRecordMastRepository(DynamoDBRepositoryBase.MASTER_TABLE_NAME)
)

