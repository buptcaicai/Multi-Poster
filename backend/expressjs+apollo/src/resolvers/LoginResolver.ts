import { Response } from "express";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { UserModel } from "~/models/User";
import { cancelToken, refreshToken } from '~/middlewares/accessTokenAuth';

@Resolver()
export class LoginResolver {
   @Mutation(() => Boolean)
   async passwordLogin(@Arg('username') username: string, 
   @Arg('password') password: string,
   @Ctx() {res}: {res: Response}): Promise<boolean> {
      const user = await UserModel.authenticateByNameAndPassword(username, password);
      if (user == null) {
         return false;
      }
      await refreshToken(res, {id: user._id.toString(), roles: user.roles});
      return true;
   }  
}
