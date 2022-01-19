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

    // ================================================
    // keys
    // ================================================
    protected getPK(input: HotelMast): string {
        return `Hotel`;
    }
    protected getSK(input: HotelMast): string {
        return `${input.hotelID}`
    }
    protected getUUID(input: HotelMast): string {
        throw new Error('Method not implemented.');
    }
    
}