import { IScoreMastRepository } from 'stage3-abr';
import { ScoreMast } from 'stage3-abr/dist/entities/type';
import { DynamoDBRepositoryBase } from '../dynamoDBRepositoryBase';

export class DynamoDBScoreMastRepository extends DynamoDBRepositoryBase<ScoreMast> implements IScoreMastRepository {
    public addScore(input: ScoreMast): Promise<ScoreMast> {
        return this.putItem({
            TableName: this.tableName,
            Item: {
                PK: this.getPK(input),
                SK: this.getSK(input),
                uuid: this.getUUID(input),
                ScoreItemID: this.getScoreItemID(input),
                ...input,
            },
            ConditionExpression: 'attribute_not_exists(#PK) AND attribute_not_exists(#SK)',
            ExpressionAttributeNames: {
                '#PK': 'PK',
                '#SK': 'SK',
            },
        });
    }

    public updateScore(input: ScoreMast): Promise<ScoreMast> {
        return this.putItem({
            TableName: this.tableName,
            Item: {
                PK: this.getPK(input),
                SK: this.getSK(input),
                uuid: this.getUUID(input),
                ScoreItemID: this.getScoreItemID(input),
                ...input,
            },
            ConditionExpression: 'attribute_exists(#PK) AND attribute_exists(#SK)',
            ExpressionAttributeNames: {
                '#PK': 'PK',
                '#SK': 'SK',
            },
        });
    }

    public async fetchScoresByScoreItemID(scoreItemID: string): Promise<ScoreMast[]> {
        return this.query({
            TableName: this.tableName,
            IndexName: 'ScoreItemIDIndex',
            KeyConditionExpression: '#PK = :PK',
            ExpressionAttributeNames: {
                '#PK': 'ScoreItemID'
            },
            ExpressionAttributeValues: {
                ':PK': scoreItemID
            },
        })
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
    protected getScoreItemID(scoreMast: ScoreMast) {
        return `${scoreMast.scoreItemID}`
    }
}
