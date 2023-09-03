"use server"  //We have to write this because we cannot write/update in DB from browser site, it has to done from server side only due to many reasons

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDb } from "../mongoos"


interface Params {
    text: string,
    author: string,
    communityId : string | null,
    path: string
}

export async function createThread({ text, author, communityId, path }: Params){
    
    try {
        connectToDb();

        const createdThread = await Thread.create({
            text,
            author, 
            community: null,
        });

        //Update the User Model with the Thread
        await User.findByIdAndUpdate(author,{
            $push : { threads : createdThread._id }
        });

        revalidatePath(path);
    } catch (error : any) {
        throw new Error(`Failed to create/update Thread: ${error.message}`);
    }  
}

export async function fetchPosts(pageNumber = 1, pageSize = 20){
    connectToDb();

    //skip posts for pages in pagination
    const skipAmount = (pageNumber - 1) * pageSize;

    //Here we have to fetch only those threads which are not comments, (only top-level posts without parent)
    const postsQuery = Thread.find({
        parentId : { $in : [null, undefined] }
    })
    .sort({createdAt : 'desc'})
    .skip(skipAmount)
    .limit(pageSize)
    .populate({path: 'author', model: User})
    .populate({
        path: "children", // Populate the children field
        populate: {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id name parentId image",
        }
    })

    const totalPostsCount = await Thread.countDocuments({parentId : { $in : [null, undefined] }})

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
}

export async function fetchThreadById(id: string){
    connectToDb();

    try {

        //TODO: populate the community later too
        const thread = Thread.findById(id)
        .populate({
            path: 'author',
            model: User,
            select: '_id id name image'
        })
        .populate({
            path: 'children',
            populate: [
                {
                    path: 'author',
                    model: User,
                    select: '_id id name parentId image'
                },
                {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    }
                }
            ]
        }).exec();

        return thread;

    } catch (error : any) {
        throw new Error(`Failed to fetch the Thread : ${error.message}`);
    }
}