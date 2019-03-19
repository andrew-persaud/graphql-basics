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

        if(data.email) {
            user.email = data.email
        }
        if(data.name) {
            user.name = data.name
        }
        if(data.age) {
            user.age = data.age
        }

        return user;


    },
    createPost(parent, args, { db }, info) {
        const userExists = db.users.some((user) => args.data.author === user.id)

        if (!userExists) {
            throw new Error('User does not exist.')
        }

        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post);
        return post;
    },
    deletePost(parent, args, { db }, info) {
        const idx = db.posts.findIndex((post) => post.id === args.id)
        if(idx === -1) {
            throw new Error("Post does not exist.")
        }
        const post = db.posts.splice(idx,1)[0]
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
        return post;
    },
    updatePost(parent, args, { db }, info) {
        const { id, data } = args
        const post = db.posts.find((post) => post.id === id)

        if (!post) {
            throw new Error('Post does not exist.')
        }

        if (data.title) {
            post.title = data.title;
        }

        if (data.body) {
            post.body = data.body
        }

        if(data.published) {
            post.published = data.published
        }

        return post
        
    },
    createComment(parent, args, { db }, info) {
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

        return comment;
    },
    deleteComment(parent, args, { db }, info) {
        const idx = db.comments.findIndex((comment) => comment.id === args.id)
        if (idx === -1) {
            throw new Error("Comment does not exist.")
        }
        return db.comments.splice(idx, 1)[0]

    },
    updateComment(parent, args, { db }, info) {
        const { id, data } = args;
        const comment = db.comments.find((comment) => comment.id === id)

        if (!comment) {
            throw new Error('Comment does not exist.')
        }

        if (data.text) {
            comment.text = data.text
        }

        return comment;
    }
}

export default Mutation;