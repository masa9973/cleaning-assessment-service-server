import { repositoryContainer } from '@/repository';
import { Handler } from 'aws-lambda';
import { Scalars } from 'stage3-abr/dist/entities/type';
import { ChillnnTrainingError, ErrorCode } from 'stage3-abr';

type UserAction =
    // record
    | 'AddRecord'
    | 'UpdateRecord'
    // score
    | 'AddScore'
    // user
    | 'UpdateUserMast'
    // hotel
    | 'AddHotel'
    // room
    | 'AddRoom'
    // scoreItem
    | 'AddScoreItem'

export const handler: Handler = async (
    //
    event: {
        input: any;
        action: UserAction;
        userID: Scalars['ID'];
    },
) => {
    let response: any = null;
    try {
        switch (event.action) {
            // ==================================================
            // Record
            // ==================================================
            case 'AddRecord':
                response = await repositoryContainer.recordMastRepository.addRecord(event.input);
                break;
            case 'UpdateRecord':
                response = await repositoryContainer.recordMastRepository.updateRecord(event.input);
                break;
            // ==================================================
            // User
            // ==================================================
            case 'UpdateUserMast':
                response = await repositoryContainer.userMastRepository.updateUserMast(event.input);
                break;
            // ==================================================
            // Score
            // ==================================================
            case 'AddScore':
                if (event.userID === event.input.scorerUserID) {
                    response = await repositoryContainer.scoreMastRepository.addScore(event.input);
                } else {
                    throw new ChillnnTrainingError(ErrorCode.chillnnTraining_400_badRequest);
                }
                break;
            // ==================================================
            // Hotel
            // ==================================================
            case 'AddHotel':
                response = await repositoryContainer.hotelMastRepository.addHotel(event.input);
                break;
            // ==================================================
            // ScoreItem
            // ==================================================
            case 'AddScoreItem':
                response = await repositoryContainer.scoreItemMastRepository.addScoreItem(event.input)
                break;
            // ==================================================
            // Room
            // ==================================================
            case 'AddRoom':
                response = await repositoryContainer.roomMastRepository.addRoom(event.input);
                break;
        }
    } catch (err) {
        console.error(err);
        throw new Error();
    }
    return response;
};