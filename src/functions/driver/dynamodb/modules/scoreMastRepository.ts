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
                ScoreCleanerIDAndScoreRoomID: this.getScoreCleanerIDAndScoreRoomID(input),
                ScoreTimeKey: this.getScoreTimeKey(input),
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
                ScoreCleanerIDAndScoreRoomID: this.getScoreCleanerIDAndScoreRoomID(input),
                ScoreTimeKey: this.getScoreTimeKey(input),
                ...input,
            },
            ConditionExpression: 'attribute_exists(#PK) AND attribute_exists(#SK)',
            ExpressionAttributeNames: {
                '#PK': 'PK',
                '#SK': 'SK',
            },
        });
    }

    public async fetchTermScoresByCleanerIDAndRoomID(scoreCleanerID: string, scoreRoomID: string, from: string, to: string): Promise<ScoreMast[]> {
        return this.query({
            TableName: this.tableName,
            IndexName: 'ScoreCleanerIDAndScoreRoomID-index',
            // #つけてる方がキーの名称、:の方に具体的な値が入るイメージ
            KeyConditionExpression: '#PK = :PK and #SK between :from and :to',
            ExpressionAttributeNames: {
                // キーの名前の設定
                '#PK': 'ScoreCleanerIDAndScoreRoomID', // 指定したキー名を設定
                '#SK': 'ScoreTimeKey',
            },
            ExpressionAttributeValues: {
                // キーの値の設定
                ':PK': `${scoreCleanerID}#${scoreRoomID}`,
                ':from': `${from}`,
                ':to': `${to}`,
            },
        });
    }

    public async fetchScoresByScoreItemID(scoreItemID: string): Promise<ScoreMast[]> {
        return this.query({
            TableName: this.tableName,
            IndexName: 'ScoreItemIDindex',
            KeyConditionExpression: '#PK = :PK',
            ExpressionAttributeNames: {
                '#PK': 'ScoreItemID',
            },
            ExpressionAttributeValues: {
                ':PK': scoreItemID,
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
    protected getScoreItemID(scoreMast: ScoreMast) {
        return `${scoreMast.scoreItemID}`;
    }
    protected getScoreCleanerIDAndScoreRoomID(scoreMast: ScoreMast) {
        return `${scoreMast.scoreCleanerID}#${scoreMast.scoreRoomID}`
    }
    protected getScoreTimeKey(scoreMast: ScoreMast) {
        return `${scoreMast.createdAt}`
    }
}
