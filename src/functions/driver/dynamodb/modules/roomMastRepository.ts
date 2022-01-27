import { IRoomMastRepository, RoomMast } from 'stage3-abr';
import { DynamoDBRepositoryBase } from '../dynamoDBRepositoryBase';

export class DynamoDBRoomMastRepository extends DynamoDBRepositoryBase<RoomMast> implements IRoomMastRepository {
    public addRoom(input: RoomMast): Promise<RoomMast> {
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

    public async deleteRoom(roomID: string): Promise<RoomMast> {
        const current = await this.fetchRoomByRoomID(roomID)
        if (!current) {
            throw new Error('404 resouce not exist')
        }
        return this.deleteItem({
            TableName: this.tableName,
            Key: this.getKey(current),
        });
    }
    
    public fetchRoomsByHotelID(roomHotelID: string): Promise<RoomMast[]> {
        return this.query({
            TableName: this.tableName,
            KeyConditionExpression: '#PK = :PK',
            ExpressionAttributeNames: {
                '#PK': 'PK',
            },
            ExpressionAttributeValues: {
                ':PK': `Room#${roomHotelID}`
            },
        })
    }

    public async fetchRoomByRoomID(roomID: string): Promise<RoomMast | null> {
        const res = await this.query({
            TableName: this.tableName,
            IndexName: DynamoDBRepositoryBase.UUIDIndexName,
            KeyConditionExpression: '#uuid = :uuid',
            ExpressionAttributeNames: {
                '#uuid': 'uuid',
            },
            ExpressionAttributeValues: {
                ':uuid': roomID,
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
    protected getPK(input: RoomMast):string {
        return `Room#${input.roomHotelID}`;
    }
    protected getSK(input: RoomMast):string {
        return `${input.roomID}#${input.createdAt}`;
    }
    protected getUUID(input: RoomMast):string {
        return `${input.roomID}`;
    }
}