import { IScoreItemMastRepository, ScoreItemMast } from 'cleaning-assessment-service-abr';
import { DynamoDBRepositoryBase } from '../dynamoDBRepositoryBase';

export class DynamoDBScoreItemMastRepository extends DynamoDBRepositoryBase<ScoreItemMast> implements IScoreItemMastRepository {
    public addScoreItem(input: ScoreItemMast): Promise<ScoreItemMast> {
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

    public async deleteScoreItem(scoreItemID: string): Promise<ScoreItemMast> {
        const current = await this.fetchScoreItemByScoreItemID(scoreItemID)
        if (!current) {
            throw new Error('404 resouce not exist');
        }
        return this.deleteItem({
            TableName: this.tableName,
            Key: this.getKey(current),
        });
    }

    public fetchScoreItemsByHotelID(scoreItemHotelID: string): Promise<ScoreItemMast[]> {
        return this.query({
            TableName: this.tableName,
            KeyConditionExpression: '#PK = :PK',
            ExpressionAttributeNames: {
                '#PK': 'PK',
            },
            ExpressionAttributeValues: {
                ':PK': `ScoreItem#${scoreItemHotelID}`,
            },
        });
    }

    public async fetchScoreItemByScoreItemID(scoreItemID: string): Promise<ScoreItemMast | null> {
        const res = await this.query({
            TableName: this.tableName,
            IndexName: DynamoDBRepositoryBase.UUIDIndexName,
            KeyConditionExpression: '#uuid = :uuid',
            ExpressionAttributeNames: {
                '#uuid': 'uuid',
            },
            ExpressionAttributeValues: {
                ':uuid': scoreItemID,
            },
        });
        if (res.length) {
            return res[0];
        } else {
            return null;
        }
    }

    // ================================================
    // keys
    // ================================================
    protected getPK(input: ScoreItemMast): string {
        return `ScoreItem#${input.scoreItemHotelID}`;
    }
    protected getSK(input: ScoreItemMast): string {
        return `${input.scoreItemID}#${input.createdAt}`;
    }
    protected getUUID(input: ScoreItemMast): string {
        return `${input.scoreItemID}`;
    }
}
