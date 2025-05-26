import { Query, Resolver } from "type-graphql";
import { Post, PostModel } from "~/models/Posts";

@Resolver(() => Post)
export class PostResolver {
    @Query(() => [Post])
    async posts(): Promise<Post[]> { 
        return await PostModel.getAllPosts();
    }
}