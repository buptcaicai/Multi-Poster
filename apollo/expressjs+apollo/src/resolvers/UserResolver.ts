import { Authorized, Query, Resolver } from "type-graphql";
import { User, UserModel } from "../models/User";

@Authorized(["admin"])
@Resolver(() => User)
export class UserResolver {
    @Query(() => [User])
    async users(): Promise<User[]> { 
        return await UserModel.getAllUsers();
    }
}
