"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDb } from "../mongoos"

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
            onboarded: true,
        },
        { upsert: true} //this is a combination of update & insert in DB
        )
    
        if(path === '/profile/edit'){ //this is to refresh data without waiting for cache to expire for a particluar page
            revalidatePath(path);
        }
    } catch (error : any) {
        throw new Error(`Failed to create/update user : ${error.message}`)
    }
}