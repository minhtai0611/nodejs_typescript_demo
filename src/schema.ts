import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Mutation {
    registerCredential(username: String!): String!
  }
`);

export default schema;