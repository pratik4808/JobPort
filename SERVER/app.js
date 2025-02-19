import 'dotenv/config'
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from 'cors';
import { readFileSync } from 'fs';
import { typeDefs } from "./graphql/schema/index.js";
import { resolvers } from './graphql/resolver/index.js';
import { default as graphqlUploadExpress } from 'graphql-upload/graphqlUploadExpress.mjs';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));

// app.use(isAuth);

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    uploads: false
});

const startApolloServer = async () => {
    await apolloServer.start();
    app.use("/graphql", expressMiddleware(apolloServer, {
        context: async ({ req }) => {
            const token = req.headers.authorization || '';
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                return { ...decoded, isAuth: true };
            } catch (err) {
                return { isAuth: false };
            }
        }
    }));

};

startApolloServer();

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER
    }:${process.env.MONGO_PASSWORD
    }@cluster0.tnliqyl.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3001);
        console.log('Server is running on port 3001');
        console.log('GraphQl Server started on localhost:3001/graphql');
    }).catch(err => {
        console.log(err);
    });


// mongoose.connect(`mongodb+srv://krunal:qwertyuiop@cluster0.4ej0mg8.mongodb.net/<your-database-name>?retryWrites=true&w=majority`)
//     .then(() => {
//         app.listen(3001);
//         console.log('Server is running on port 3001');
//         console.log('GraphQl Server started on localhost:3001/graphql');
//     }).catch(err => {
//         console.log(err);
//     });