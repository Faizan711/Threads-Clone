'use client'

import * as z from "zod"
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from "../ui/input";
import { usePathname, useRouter } from "next/navigation";
import { commentValidation } from "@/lib/validations/thread";
// import { createThread } from "@/lib/actions/thread.actions";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import Image from "next/image";
import User from "@/lib/models/user.model";
import { addCommentToThread } from "@/lib/actions/thread.actions";

interface Props {
    threadId : string;
    currentUserImg : string;
    currentUserId : string;
}

const Comment = ({
    threadId,
    currentUserImg,
    currentUserId
} : Props) => {

    const router = useRouter();
    const pathname  = usePathname();

    const form = useForm({
        resolver: zodResolver(commentValidation),
        defaultValues: {
            thread: ''
        }
    });

    const onSubmit = async (values : z.infer<typeof commentValidation>) => {
        //parsed the currentUserId to string
        await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname); 

        form.reset();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form ">
                <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                <FormItem className="flex w-full items-center gap-3 ">
                    <FormLabel>
                        <Image
                        src={currentUserImg}
                        alt="profile photo"
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                        />
                    </FormLabel>
                    <FormControl className="border-none bg-transparent">
                    <Input 
                        type="text"
                        placeholder="Comment ..."
                        className="no-focus text-light-1 outline-none"
                        {...field}
                    />
                    </FormControl>
                </FormItem>
                )}
                />
                <Button type="submit" className="comment-form_btn">
                    Reply
                </Button>
            </form>
        </Form>
    )
}

export default Comment;