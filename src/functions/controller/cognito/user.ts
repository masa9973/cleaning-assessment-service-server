import { repositoryContainer } from '@/repository';
import { UserCognitoService } from '@/service/cognito/userService';
import { CustomMessageTriggerEvent, CustomMessageTriggerHandler } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

const userCognitoService = new UserCognitoService(repositoryContainer);

export const handler: CustomMessageTriggerHandler = async (event: CustomMessageTriggerEvent) => {
    switch (event.triggerSource) {
        case 'CustomMessage_SignUp':
            // // サインアップ
            if (event.request.clientMetadata)
            return await userCognitoService.registerService(event);
        case 'CustomMessage_ForgotPassword':
        // return new CognitoForgotPasswordService().passwordReset(event);
        default:
            return event;
    }
};