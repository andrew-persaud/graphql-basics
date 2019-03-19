import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'
import Subscription from './resolvers/Subscription'

const pubsub = new PubSub()


const resolvers = {
    Query,
    Mutation,
    Post,
    User,
    Comment,
    Subscription 
}

const server = new GraphQLServer({
    typeDefs : './src/schema.graphql',
    resolvers,
    context: {
        db,
        pubsub
    }
});


server.start(() => {
    console.log('The server is up!');
});

/*  
typeDefs are schema declarations for custom types and mutations
Resolvers are your objects holding functions to process non scalar query returns
the context is your database that gets passed to your resolver functions
*/