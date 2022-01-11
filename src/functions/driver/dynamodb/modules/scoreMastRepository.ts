import { IScoreMastRepository } from 'stage3-abr';
import { ScoreMast } from 'stage3-abr/dist/entities/type';
import { DynamoDBRepositoryBase } from '../dynamoDBRepositoryBase';

export class DynamoDBScoreMastRepository extends DynamoDBRepositoryBase<ScoreMast> implements IScoreMastRepository {
    public addScore(input: ScoreMast): Promise<ScoreMast> {
        return this.putItem({
            // ここでappsyncからのIDは取得できる？→できない。
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
    public async fetchScoresByRecordID(recordID: string): Promise<ScoreMast[]> {
        return this.query({
            TableName: this.tableName,
            KeyConditionExpression: '#PK = :PK',
            ExpressionAttributeNames: {
                '#PK': 'PK',
            },
            ExpressionAttributeValues: {
                ':PK': `Score#${recordID}`,
            },
        });
    }
    // ================================================
    // keys
    // ================================================
    protected getPK(scoreMast: ScoreMast) {
        return `Score#${scoreMast.recordID}`;
    }
    protected getSK(scoreMast: ScoreMast) {
        return `${scoreMast.createdAt}#${scoreMast.scoreID}`;
    }
    protected getUUID(scoreMast: ScoreMast) {
        return `${scoreMast.scoreID}`;
    }
}