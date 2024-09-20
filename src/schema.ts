import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull } from 'graphql';
import { getMessages, saveMessage } from './mariadb';

// Define Message Type
const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        id: { type: GraphQLID },
        content: { type: GraphQLString },
        senderId: { type: GraphQLID },
        timestamp: { type: GraphQLString }
    })
});

// Define Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        messages: {
            type: new GraphQLList(MessageType),
            resolve(parent, args) {
                // Logic to fetch messages from the database
                return getMessages(); // Assume this function fetches messages
            }
        }
    }
});

// Define Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addMessage: {
            type: MessageType,
            args: {
                content: { type: new GraphQLNonNull(GraphQLString) },
                senderId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                // Logic to save message in the database
                return saveMessage(args.content, args.senderId); // Assume this function saves the message
            }
        }
    }
});

// Create Schema
const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

export default schema;