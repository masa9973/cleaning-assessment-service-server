import { repositoryContainer } from '@/repository';
import { Handler } from 'aws-lambda';
import { Scalars } from 'stage3-abr/dist/entities/type';
import { ChillnnTrainingError, ErrorCode } from 'stage3-abr';

type UserAction =
    // record
    | 'AddRecord'
    // score
    | 'AddScore'
    // user
    | 'UpdateUserMast';

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
            // ==================================================
            // User
            // ==================================================
            case 'UpdateUserMast':
                response = await repositoryContainer.userMastRepository.updateUserMast(event.input);
                break;
            // ==================================================
            // Score
            //===================================================
            case 'AddScore':
                if (event.userID === event.input.scorerUserID) {
                    response = await repositoryContainer.scoreMastRepository.addScore(event.input);
                } else {
                    throw new ChillnnTrainingError(ErrorCode.chillnnTraining_400_badRequest);
                }
                break;
        }
    } catch (err) {
        console.error(err);
        throw new Error();
    }
    return response;
};