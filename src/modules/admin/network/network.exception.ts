import { ApiException } from '@/common/exceptions';
import { ApiErrorInterface } from '@/common/interfaces';

export class NetworkException extends ApiException {
    constructor(objectOrError?: ApiErrorInterface, error?: any) {
        super(objectOrError, error);
    }
}
