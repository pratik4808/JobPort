module.exports = `
    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String
        creationDate: String!
        birthDate: String
        accountType: AccountType!
    }

    type AccountType {
        _id: ID!
        name: String!
    }

    input UserInput {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        birthDate: String
        accountType: String!
    }

    type AuthData {
        userId: ID!
    }

    type Query {
        users: [User!]!
        login(email: String!, password: String!): AuthData!
    }

    type Mutation {
        createUser(userInput: UserInput): User
    }
`;
