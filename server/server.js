let express = require("express");
let graphqlHTTP = require("express-graphql");
let { buildSchema } = require("graphql");
let cors = require("cors");

let schema = buildSchema(`
    type User {
        id : String!
        nickname : String!
        avatar : String!
    }
    type Post {
        id: String!
        user: User!
        caption : String!
        image : String!
    }
    type Query{
        user(id: String) : User!
        post(user_id: String, post_id: String) : Post!
        post(user_id: String) : [Post]
    }
    `);
// Maps id to User object
let userslist = {
    a: {
        a: {
            id: "a",
            user: userslist["a"],
            caption: "Moving the community!",
            image: "https://pbs.twimg.com/media/DOXI0IEXkAAkokm.jpg"
        },
        b: {
            id: "b",
            user: userslist["a"],
            caption: "Angular Book :)",
            image: "https://cdn-images-1.medium.com/max/1000/1*ltLfTw87lE-Dqt-BKNdj1A.jpeg"
        },
        
    }
};

let root = {
    user: function({ id }) {
        return userslist[id];
    },
    post: function({ user_id , post_id }) {
        return postslists[user_id][post_id];
    },
    posts: function({ user_id }){
        return Object.values(postslist[user_id]);
    }
};