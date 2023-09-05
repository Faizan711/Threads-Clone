"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDb } from "../mongoos"
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
    userId: string,
    username: string,
    name: string, 
    bio: string,
    image: string,
    path: string
}

//getting all user details through props to update it
export async function updateUser(
    {
        userId,
        username,
        name,
        bio,
        image,
        path 
    } : Params
): Promise<void> {
    connectToDb();

    try {
        await User.findOneAndUpdate({ id: userId }, { //Find using userId and pass new info
            username: username.toLowerCase(),
            name,
            bio,
            image,
            onboarding: true,
        },
        { upsert: true} //this is a combination of update & insert in DB
        )
    
        if(path === '/profile/edit'){ //this is to refresh data without waiting for cache to expire for a particluar page
            revalidatePath(path);
        }
    } catch (error : any) {
        throw new Error(`Failed to create/update user: ${error.message}`);
    }
};


//to fetch user from DB using id
export async function fetchUser(userId : string){
    try {
        connectToDb();

        return await User
        .findOne({id : userId})
        // .populate({
        //     path: "Communities",
        //     model: Community
        // })
    } catch (error : any) {
        throw new Error(`Failed to fetch User : ${error.message}`);
    }
};

//to fetch user's threads from DB
export async function fetchUserPosts(userId : string){
    try {
        connectToDb();

        const threads = await User.findOne({id : userId})
        .populate({
            path:'threads',
            model: Thread,
            populate:{
                path:'children',
                model: Thread,
                populate:{
                    path: 'author',
                    model: User,
                    select: 'name image id'
                }
            }
        })

        return threads;
    } catch (error : any) {
        throw new Error(`Failed to fetch Posts : ${error.message}`);
    }
};


export async function fetchUsers({
    userId,
    searchString= "",
    pageNumber= 1,
    pageSize= 20,
    sortBy= "desc"
 } : {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize? : number;
    sortBy?: SortOrder;
 }){
    try {
        connectToDb();

        const skipAmount = (pageNumber - 1) * pageSize;
        
        const regex = new RegExp(searchString, "i");

        const query : FilterQuery<typeof User> = {  //filter is from mongoose to define user type for query
            id: {$ne : userId}  //this is to prevent search is userId is my own
        }

        if(searchString.trim() !== ''){
            query.$or = [
                {username: { $regex : regex }},
                {name: { $regex : regex }}
            ]
        }

        const sortOptions = { createdAt : sortBy };

        const usersQuery = User.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize);

        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery.exec();

        const isNext = totalUsersCount > skipAmount + users.length;

        return {
            users,
            isNext
        };
        
    } catch (error : any) {
        throw new Error(`Failed to fetch Users : ${error.message}`);
    }
}


export async function getActivity(userId : string){
    try {
        connectToDb();

        //find all threads of the user
        const userThreads = await Thread.find({author: userId});

        //collect all children threads id 
        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children)
        },[]) //we have to pass this array not as a dependency but as a default value for acc

        //get the replies (basically the threads with different owners on my thread)
        const replies = await Thread.find({
            _id: {$in : childThreadIds},
            author: {$ne : userId}
        }).populate({
            path: 'author',
            model: User,
            select: 'name image _id'
        })

        return replies;

    } catch (error : any) {
        throw new Error(`Failed to fetch activities : ${error.message}`);
    }
}