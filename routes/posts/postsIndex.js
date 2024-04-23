const express = require("express");
const postsRouter = express.Router();



postsRouter.use("/posts", require("./posts.js"));
postsRouter.use("/posts", require("./postsTrends.js"));
postsRouter.use("/posts", require("./postActions.js"));


module.exports = postsRouter;
