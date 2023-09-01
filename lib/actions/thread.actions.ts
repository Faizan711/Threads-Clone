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