import { CustomMessageSignUpTriggerEvent } from 'aws-lambda';
import AWS from 'aws-sdk';
import { generateUUID, RepositoryContainer } from 'cleaning-assessment-service-abr';

const cognito = new AWS.CognitoIdentityServiceProvider({});

export class UserCognitoService {
    constructor(
        private repositoryContainer: RepositoryContainer, //
    ) {}

    public async registerService(input: CustomMessageSignUpTriggerEvent) {
        const userID = input.userName;
        const email = input.request.userAttributes.email;
        const now = new Date().getTime();
        const ID = generateUUID()
        try {
            await this.repositoryContainer.userMastRepository.addUserMast({
                userID,
                email,
                name: '名無し',
                userIcon: null,
                createdAt: now,
                updatedAt: now,
                role: 'manager',
                userHotelID: ID,
            });
        } catch (err) {
            console.error(err);
            await cognito
                .adminDeleteUser({
                    UserPoolId: input.userPoolId,
                    Username: userID,
                })
                .promise();
            throw new Error('ユーザーがすでに存在しています');
        }

        const codeParameter: string = input.request.codeParameter || '{####}';
        input.response.emailSubject = `【新規登録】認証コードをお送りします`;
        input.response.emailMessage = `認証コード = ${codeParameter}`;
        return input;
    }
}
