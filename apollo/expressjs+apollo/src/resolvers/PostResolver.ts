import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Post, PostModel } from "../models/Post";

@Authorized(["user"])
@Resolver(() => Post)
export class PostResolver {
    @Query(() => [Post])
    async posts(): Promise<Post[]> { 
        return await PostModel.getAllPosts();
    }

    @Query(() => Post, { nullable: true })
    async post(): Promise<Post | null> {
        return await PostModel.findOne();
    }

    @Mutation(() => Post)
    async addPost(
        @Arg("text") text: string,
        @Arg("name") name: string
    ): Promise<Post> {
        console.log(`Adding post with text: ${text} and name: ${name}`);
        const newPost = await PostModel.create({ text, name });
        return newPost;
    }
}