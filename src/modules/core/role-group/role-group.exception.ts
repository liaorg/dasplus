import { ApiException } from '@/common/exceptions';
import { ApiErrorInterface } from '@/common/interfaces';

export class RoleGroupException extends ApiException {
    constructor(objectOrError?: ApiErrorInterface) {
        super(objectOrError);
    }
}
