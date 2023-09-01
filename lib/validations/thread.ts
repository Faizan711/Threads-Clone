import * as z from 'zod';

//Validation of a Thread
export const threadValidation = z.object({
    thread : z.string().nonempty().min(3, {message: "minimun 3 characters"}),
    accountId : z.string()
});

// Validation of a comment which is in itself a thread too
// export const threadValidation = z.object({
//     thread : z.string().nonempty().min(3, {message: "minimun 3 characters"}),
//     accountId : z.string()
// });