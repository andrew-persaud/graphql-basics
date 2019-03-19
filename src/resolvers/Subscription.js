const Subscription = {
    post : {
        subscribe(parent, args, { db, pubsub }, info) {
         
           return pubsub.asyncIterator("post")
        }
    },
    comment: {
        subscribe(parent, { postId }, { db, pubsub }, info) {
            const post = db.posts.find((post) => post.id === postId && post.published)
            if(!post) {
                throw new Error('Post does not exist')
            }

            return pubsub.asyncIterator(`comment: ${postId}`)
        }
    }
}

export default Subscription