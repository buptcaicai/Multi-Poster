import { Response } from "express";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { UserModel } from "../models/User";
import { cancelToken, getUserFromRefreshToken, refreshToken, validateRefreshToken } from '../middlewares/accessTokenAuth';
import { Field, ID, ObjectType } from 'type-graphql';
import { GQLContext } from "..";
import { LOGIN_REQUIRED_ERROR } from "../constants";
import { JWTPayload } from "../utils/jwt";

@ObjectType()
class LoginResponse {
   @Field(() => ID)
   public _id!: string;

   @Field()
   public username!: string;

   @Field(() => [String])
   public roles!: string[];
};

@ObjectType()
class RefreshTokenResponse implements JWTPayload {
   @Field(() => ID)
   public id!: string;
   @Field(() => [String])
   public roles!: string[];
}

@Resolver()
export class LoginResolver {
   @Mutation(() => LoginResponse, { nullable: true })
   async passwordLogin(@Arg('username') username: string, 
                       @Arg('password') password: string,
                       @Ctx() {res}: {res: Response}) {
      const user = await UserModel.authenticateByNameAndPassword(username, password);
      if (user == null) {
         return null;
      }
      await refreshToken(res, {id: user._id.toString(), roles: user.roles});
      return {username: user.name, roles: user.roles};
   }

   @Mutation(() => Boolean)
   async logout(@Ctx() {res}: {res: Response}) {
      await cancelToken(res);
      return true;
   }

   @Mutation(() => RefreshTokenResponse)
   async refreshLogin(@Ctx() { req, res, user }: GQLContext) {
      if (await validateRefreshToken(req, null) == false) {
         if (process.env.NODE_ENV !== 'production') {
            console.log('refreshAccessToken: validateRefreshToken failed');
         }
         throw new Error(LOGIN_REQUIRED_ERROR);
      }
      let localUser = user?? null;
      if (localUser == null) {
         localUser = await getUserFromRefreshToken(req);
         if (localUser == null) {
            if (process.env.NODE_ENV !== 'production') {
               console.log('getUserFromRefreshToken failed');
            }
            throw new Error(LOGIN_REQUIRED_ERROR);
         }
      }
      await refreshToken(res, localUser)
      return localUser;
   }
}
