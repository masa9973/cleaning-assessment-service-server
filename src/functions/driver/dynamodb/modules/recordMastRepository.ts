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

    public updateRecordMast(input: RecordMast): Promise<RecordMast> {
        return this.putItem({
            TableName: this.tableName,
            Item: {
                PK: this.getPK(input),
                SK: this.getSK(input),
                uuid: this.getUUID(input),
                ...input,
            },
            ConditionExpression: 'attribute_exists(#PK) AND attribute_exists(#SK)',
            ExpressionAttributeNames: {
                '#PK': 'PK',
                '#SK': 'SK',
            },
        });
    }

    public fetchRecordsByCleanerID(cleanerID: string): Promise<RecordMast[]> {
        return this.query({
            TableName: this.tableName,
            KeyConditionExpression: '#indexKey = :indexValue',
            ExpressionAttributeNames: {
                "#indexKey"  : 'cleanerID' // GSIの作成時に指定したキー名を設定
            },
            ExpressionAttributeValues: {
                ':indexValue': cleanerID
            },
        });
    }

    // GSI機能してるかわからん
    public fetchRecordsByRoomID(cleaningRoomID: string): Promise<RecordMast[]> {
        return this.query({
            TableName : this.tableName,
            IndexName: 'cleaningRoomID-index',
            KeyConditionExpression: '#indexKey = :indexValue',
            ExpressionAttributeNames : {
                "#indexKey"  : 'cleaningRoomID' // GSIの作成時に指定したキー名を設定
            },
            ExpressionAttributeValues: {
                ':indexValue': cleaningRoomID
            },
        });
    }

    public fetchAllRecordsByHotelID(hotelID: string): Promise<RecordMast[]> {
        return this.query({
            TableName: this.tableName,
            KeyConditionExpression: '#PK = :PK and begins_with(#SK, :SK)',
            ExpressionAttributeNames: {
                '#PK': 'PK',
                '#SK': 'SK',
            },
            ExpressionAttributeValues: {
                ':PK': `Record`,
                ':SK': hotelID
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
        return `${input.hotelID}#${input.createdAt}`;
    }
    protected getUUID(input: RecordMast):string {
        return `${input.recordID}`;
    }
}