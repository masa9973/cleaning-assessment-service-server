import { repositoryContainer } from '@/repository';
import { Handler } from 'aws-lambda';
import { Scalars } from 'cleaning-assessment-service-abr/dist/entities/type';
import { ChillnnTrainingError, ErrorCode } from 'cleaning-assessment-service-abr';
import { AddTestRecord } from '@/service/test/addTestRecord';

type UserAction =
    // record
    | 'AddRecord'
    | 'UpdateRecord'
    | 'AddTestRecord'
    // score
    | 'AddScore'
    | 'UpdateScore'
    // user
    | 'UpdateUserMast'
    // hotel
    | 'AddHotel'
    // room
    | 'AddRoom'
    | 'DeleteRoom'
    // scoreItem
    | 'AddScoreItem'
    | 'DeleteScoreItem'

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
            case 'AddTestRecord':
                // テストをインスタンス化
                response = await repositoryContainer.recordMastRepository.addRecord(event.input)
                const addTestRecord = new AddTestRecord(response, repositoryContainer.recordMastRepository, repositoryContainer.scoreMastRepository, repositoryContainer.scoreItemMastRepository)
                await addTestRecord.addTestRecord()
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
            case 'UpdateScore':
                response = await repositoryContainer.scoreMastRepository.updateScore(event.input)
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
            // case 'DeleteScoreItem':
            //     response = await repositoryContainer.scoreItemMastRepository.deleteScoreItem(event.input)
            //     break;
            // ==================================================
            // Room
            // ==================================================
            case 'AddRoom':
                response = await repositoryContainer.roomMastRepository.addRoom(event.input);
                break;
        //     case 'DeleteRoom':
        //         response = await repositoryContainer.roomMastRepository.deleteRoom(event.input)
        }
    } catch (err) {
        console.error(err);
        throw new Error();
    }
    return response;
};