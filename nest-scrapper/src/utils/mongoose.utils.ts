export const removeMongoProperties =(obj:Object)=>{
    delete obj['__v']
    delete obj['_id']
}