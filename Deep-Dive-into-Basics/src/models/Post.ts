import * as mongoose from 'mongoose';
import {model} from 'mongoose';
import Comment from './Comment'

const postSchema = new mongoose.Schema({
    user_id: {type:mongoose.Types.ObjectId, required: true},
    content: {type: String, required: true},
    created_at: {type: Date, required:true},
    updated_at: {type: Date, required:true},

    // comments
    comments:[{type:mongoose.Types.ObjectId,ref:'comments'}]
});

/*---Add Virtual Field--*/
postSchema.virtual('commentCount').get( function () {
   return this.comments.length;
})

/*---Remove Comment's Virtual Field while Post Deleted--*/
postSchema.post('remove',(async doc=>{
    for(let id of (doc as any).comments){
        await Comment.findByIdAndDelete({_id: id})
    }
}))

export default model('posts', postSchema)