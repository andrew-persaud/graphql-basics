import uuidv4 from 'uuid/v4';

const Mutation = {
    createUser(parent, args, { db }, info) {
       const emailTaken = db.users.some((user) => user.email === args.data.email)

       if (emailTaken) {
           throw new Error('Email is taken')
       }

       const user = {
           id: uuidv4(),
            ...args.data
       }

       db.users.push(user)
       return user
    },
    deleteUser(parent, args, {  db }, info) {
        const idx = db.users.findIndex((user) => user.id === args.id)

        if (idx === -1) {
            throw new Error('User does not exist.')
        }

        const user = db.users.splice(idx, 1)[0]
       
        db.posts = db.posts.filter((post) => {
            const match = post.author === args.id

            if(match) {
                db.comments = db.comments.filter((comment) => comment.post !== post.id)
            }

            return !match
        })

        db.comments = db.comments.filter((comment) => comment.author !== args.id);

        return user;
    },
    updateUser(parent, args, { db }, info) {
        const { id, data } = args 
        const user = db.users.find((user) => user.id === id)

        if (!user) {
            throw new Error('User does not exist.')
        }

        const emailAlreadyExists = db.users.some((user) => user.email === data.email)

        if(emailAlreadyExists) {
            throw new Error('Email in use. Please choose another')
        }
        if (data.age <= 0) {
            throw new Error('Please enter valid age');
        }

        user.email = data.email || user.email
        user.name = data.name || user.name
        user.age = data.age || user.age

        return user;


    },
    createPost(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => args.data.author === user.id)

        if (!userExists) {
            throw new Error('User does not exist.')
        }

        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post);
        if (post.published === true) {
            pubsub.publish("post", {
                post : {
                    mutation: 'CREATED',
                    data: post
                }
            })
        }
       
        return post;
    },
    deletePost(parent, args, { db, pubsub }, info) {
        const idx = db.posts.findIndex((post) => post.id === args.id)
        if(idx === -1) {
            throw new Error("Post does not exist.")
        }
        const post = db.posts.splice(idx,1)[0]
        db.comments = db.comments.filter((comment) => comment.post !== post.id);

        if (post.published === true) {
            pubsub.publish('post', {
                post : {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }
        return post;
    },
    updatePost(parent, args, { db, pubsub }, info) {
        const { id, data } = args
        const post = db.posts.find((post) => post.id === id)
        const unalteredPost = {...post}

        if (!post) {
            throw new Error('Post does not exist.')
        }

        post.title = data.title || post.title
        post.body = data.body || post.body
        post.published = data.published || post.published

        if (unalteredPost.published && !post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        } else if (!unalteredPost.published && post.publised) {
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        } else if((data.title || data.body) && post.published)  {
            pubsub.publish('post', {
                post : {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post
        
    },
    createComment(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => user.id === args.data.author)
        if (!userExists) {
            throw new Error('User does not exist.')
        }
        const postExists = db.posts.some((post) => post.id === args.data.post)
        if(!postExists) {
            throw new Error('Post does not exist')
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        }
        db.comments.push(comment)
        pubsub.publish(`comment: ${args.data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
                
            }
        })
        return comment;
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        const idx = db.comments.findIndex((comment) => comment.id === args.id)
        if (idx === -1) {
            throw new Error("Comment does not exist.")
        }
        const removedComment = db.comments.splice(idx, 1)[0]

        pubsub.publish(`comment: ${removedComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: removedComment
            }
        } )

        return removedComment


    },
    updateComment(parent, args, { db, pubsub }, info) {
        const { id, data } = args;
        const comment = db.comments.find((comment) => comment.id === id)

        if (!comment) {
            throw new Error('Comment does not exist.')
        }

        comment.text = data.text || comment.text
        pubsub.publish(`comment: ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })

        return comment;
    }
}

export default Mutation;