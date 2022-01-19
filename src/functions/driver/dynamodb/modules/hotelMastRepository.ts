import { HotelMast, IHotelMastRepository } from 'stage3-abr';
import { DynamoDBRepositoryBase } from '../dynamoDBRepositoryBase';

export class DynamoDBHotelMastRepository extends DynamoDBRepositoryBase<HotelMast> implements IHotelMastRepository {
    
    public addHotel(input: HotelMast): Promise<HotelMast> {
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

    public async fetchHotelByHotelID(hotelID: string): Promise<HotelMast> {
        const res = await this.query({
            TableName: this.tableName,
            KeyConditionExpression: '#PK = :PK',
            ExpressionAttributeNames: {
                '#PK': 'PK',
            },
            ExpressionAttributeValues: {
                ':PK': `Hotel#${hotelID}`
            },
        })
        return res[0];
    }

    // ================================================
    // keys
    // ================================================
    protected getPK(input: HotelMast): string {
        return `Hotel${input.hotelID}`;
    }
    protected getSK(input: HotelMast): string {
        throw new Error('Method not implemented.');
    }
    protected getUUID(input: HotelMast): string {
        throw new Error('Method not implemented.');
    }
    
}