import { Response } from "express";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { UserModel } from "~/models/User";
import { cancelToken, refreshToken } from '~/middlewares/accessTokenAuth';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
class LoginResponse {
   @Field(() => ID)
   public _id!: string;

   @Field()
   public username!: string;

   @Field(() => [String])
   public roles!: string[];
};
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
}
