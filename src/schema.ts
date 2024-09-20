import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLScalarType } from 'graphql';
import { getMessages, saveMessage } from './mariadb';
import { Kind } from 'graphql/language';

// Define DateTime scalar
const DateTime = new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date-time value',
    serialize(value) {
        // Convert outgoing Date to ISO string
        return value instanceof Date ? value.toISOString() : null;
    },
    parseValue(value) {
        // Convert incoming ISO string to Date
        return new Date(value);
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value); // Convert hard-coded AST string to Date
        }
        return null; // Invalid hard-coded value (not an ISO string)
    }
});

// Define Message Type
const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        id: { type: GraphQLID },
        content: { type: GraphQLString },
        senderId: { type: GraphQLID },
        timestamp: { type: DateTime }
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