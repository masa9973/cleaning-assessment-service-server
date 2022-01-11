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
    // public async deleteRecord(RecordID: string): Promise<RecordMast> {
    //     const current = await this.fetchRecordByRecordID(RecordID);
    //     if (!current) {
    //         throw new Error('404 resouce not exist');
    //     }
    //     return this.deleteItem({
    //         TableName: this.tableName,
    //         Key: this.getKey(current),
    //     });
    // }
    public fetchRecordsByCleanerID(userID: string): Promise<RecordMast[]> {
        return this.query({
            TableName: this.tableName,
            KeyConditionExpression: '#PK = :PK',
            ExpressionAttributeNames: {
                '#PK': 'PK',
            },
            ExpressionAttributeValues: {
                ':PK': `Record#${userID}`,
            },
        });
    }
    // public async fetchRecordByRecordID(RecordID: string): Promise<RecordMast | null> {
    //     const res = await this.query({
    //         TableName: this.tableName,
    //         IndexName: DynamoDBRepositoryBase.UUIDIndexName,
    //         KeyConditionExpression: '#uuid = :uuid',
    //         ExpressionAttributeNames: {
    //             '#uuid': 'uuid',
    //         },
    //         ExpressionAttributeValues: {
    //             ':uuid': RecordID,
    //         },
    //     });
    //     if (res.length) {
    //         return res[0];
    //     } else {
    //         return null;
    //     }
    // }

    // ================================================
    // keys
    // ================================================
    protected getPK(recordMast: RecordMast) {
        return `Record#${recordMast.cleanerID}`;
    }
    protected getSK(recordMast: RecordMast) {
        return `${recordMast.createdAt}#${recordMast.recordID}`;
    }
    protected getUUID(recordMast: RecordMast) {
        return `${recordMast.recordID}`;
    }
}