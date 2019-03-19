const Query = {
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users;
        }

        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase());
        })
    },
    posts(parent, args, { db}, info) {
        if (!args.query) {
            return db.posts
        }

        return db.posts.filter((post) => post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase())
        )
    },
    comments(parent, args, { db}, info) {
        return db.comments
    },
    me() {
        return {
            id: '123',
            name: 'Drew',
            email: "weee",
            age: null
        }
    },
    post() {
        return {
            id: '113',
            title: 'Bloggeroo',
            body: 'This is a lit blog post.',
            published: true
        }
    }
}

export default Query;