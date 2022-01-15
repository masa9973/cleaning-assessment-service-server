import { IRecordMastRepository } from 'stage3-abr';
import { RecordMast } from 'stage3-abr/dist/entities/type';
import { DynamoDBRepositoryBase } from '../dynamoDBRepositoryBase';

export class DynamoDBRecordMastRepository extends DynamoDBRepositoryBase<RecordMast> implements IRecordMastRepository {
    public addRecord(input: RecordMast): Promise<RecordMast> {
        return this.putItem({
            TableName: this.tableName,
            Item: {
                PK: this.getPK(input),
                SK: this.getSK(input),
                uuid: this.getUUID(input),
                ...input,
            },
            ConditionExpression: 'attribute_not_exists(#PK) AND attribute_not_exists(#SK)',
            ExpressionAttributeNames: {
                '#PK': 'PK',
                '#SK': 'SK',
            },
        });
    }

    public fetchRecordsByCleanerID(userID: string): Promise<RecordMast[]> {
        return this.query({
            TableName: this.tableName,
            KeyConditionExpression: '#PK = :PK and begins_with(#SK, :SK)',
            ExpressionAttributeNames: {
                '#PK': 'PK',
                '#SK': 'SK',
            },
            ExpressionAttributeValues: {
                ':PK': 'Record',
                ':SK': userID
            },
        });
    }

    public fetchAllRecords(): Promise<RecordMast[]> {
        console.log('dynamoDBfetchAllRecords')
        return this.query({
            TableName: this.tableName,
            KeyConditionExpression: '#PK = :PK',
            ExpressionAttributeNames: {
                '#PK': 'PK',
            },
            ExpressionAttributeValues: {
                ':PK': 'Record'
            },
        });
    }

    // ================================================
    // keys
    // ================================================
    protected getPK(input: RecordMast):string {
        return `Record`;
    }
    protected getSK(input: RecordMast):string {
        return `${input.cleanerID}#${input.createdAt}`;
    }
    protected getUUID(input: RecordMast):string {
        return `${input.recordID}`;
    }
}