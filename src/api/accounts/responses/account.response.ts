import {UserRoleEnum} from "../../../enums/user-role.enum";
import {UserEntity} from "../../../db/entities/user.entity";
import {assign, keys, pick} from "lodash";

export class AccountResponse {
    login?: string = undefined;

    id?: number = undefined;

    role?: UserRoleEnum = undefined;

    constructor(data?: UserEntity) {
        if (data) {
            assign(this, pick(data, keys(new AccountResponse())))
        }
    }
}