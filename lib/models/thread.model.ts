import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
    text: { type: String, required: true},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    parentId: {  //this is if this is a comment not a original thread
        type: String,
    },
    children: [ //This is to make one thread have multiple threads as children possible
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ]
});

const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema);

export default Thread;