let express = require("express");
let graphqlHTTP = require("express-graphql");
let { buildSchema } = require("graphql");
let cors = require("cors");
let Pusher = require('pusher');
let bodyParser = require('body-parser');
let Multipart = require('connect-multiparty');

let schema = buildSchema(`
    type User {
        id: String!
        nickname: String!
        avatar: String!
    }

    type Post {
        id: String!
        user: User!
        caption: String!
        image: String!
    }

    type Query{
        user(id: String) : User!
        post(user_id: String, post_id: String) : Post!
        posts(user_id: String) : [Post]
    }
    `);
let userslist = {
    a: {
        id: "a",
        nickname: "Chris",
        avatar: "https://www.laravelnigeria.com/img/chris.jpg"
    },
    b: {
        id: "b",
        nickname: "James",
        avatar: "https://i.imgur.com/OI65Tkh.png"
    }
};
let postslist = {
  a: {
    a: {
      id: "a",
      user: userslist["a"],
      caption: "dude at Coachella!",
      image: "https://i.imgur.com/K82y6PV.png"
    },
    b: {
      id: "b",
      user: userslist["a"],
      caption: "cute guy at Coachella",
      image: "https://i.imgur.com/rNy0j9g.png"
    },
    c: {
      id: "c",
      user: userslist["b"],
      caption: "me backpacking",
      image: "https://i.imgur.com/6zRkaPM.jpg"
    },
    d: {
      id: "d",
      user: userslist["b"],
      caption: "nice view backpacking",
      image: "https://i.imgur.com/UCiAFsA.jpg"
    }
  }
};
let pusher = new Pusher({
  appId: 'PUSHER_APP_ID',
  key: 'PUSHER_APP_KEY',
  secret: 'PUSHER_APP_SECRET',
  cluster: 'PUSHER_CLUSTER',
  encrypted: true
})

let root = {
  user: function({ id }) {
    return userslist[id];
  },
  post: function({ user_id, post_id }) {
    return postslist[user_id][post_id];
  },
  posts: function({ user_id }) {
    return Object.values(postslist[user_id]);
  }
};

let app = express();
app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

let multipartMiddleware = new Multipart();

app.post('/newpost', multipartMiddleware, (req, res) => {
  let post = {
    user: {
      nickname: req.body.name, 
      avatar: req.body.avatar
    }, 
    image: req.body.image, 
    caption: req.body.caption
  }
  pusher.trigger('posts-channel', "new-post", {
    post
  });
  return res.json({status : 'Post Created'});
});

app.listen(4000);
console.log("Running a GraphQL API server at localhost:4000/graphql");