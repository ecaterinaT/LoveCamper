const Koa = require("koa");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const logger = require('koa-logger');
const ObjectID = require("mongodb").ObjectID;

const app = new Koa();
const router = new Router();
const securedRouter = new Router();
const jwt = require("./jwt");

require("./mongo")(app);

//app.use(jwt.errorHandler()).use(jwt.jwt());
securedRouter.use(jwt.errorHandler()).use(jwt.jwt());

// Use the bodyparser middlware
app.use(BodyParser());
app.use(logger());
// Create a new securedRouter

// Add the securedRouter to our app as well
app.use(router.routes()).use(router.allowedMethods());
app.use(securedRouter.routes()).use(securedRouter.allowedMethods());

router.post("/login", async (ctx) => {
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;

    if (username === "user" && password === "pwd") {
        ctx.body = {
            token: jwt.issue({
                user: "user",
                role: "admin"
            })
        }
    } else {
        ctx.status = 401;
        ctx.body = {error: "Invalid login"}
    }
});

// router.get("/", async function (ctx) {
//     ctx.body = {message: "Hello World! =============="}
// });

// List all people
router.get("/people", async (ctx) => {
    ctx.body = await ctx.app.people.find().toArray();
});

// securedRouter.get("/", async function (ctx) {
//     let name = ctx.request.query.name || "World";
//     ctx.body = {message: `Hello ${name}!`}
// });

securedRouter.post("/", async function (ctx) {
    let name = ctx.request.body.name || "World";
    ctx.body = {message: `Hello ${name}!`}
});

securedRouter.post("/people", async (ctx) => {
    ctx.body = await ctx.app.people.insert(ctx.request.body);
});

securedRouter.get("/secure", async (ctx) => {
    ctx.body = await ctx.app.people.find().toArray();
});

// Get one
securedRouter.get("/people/:id", async (ctx) => {
    ctx.body = await ctx.app.people.findOne({"_id": ObjectID(ctx.params.id)});
});

// Create new person
securedRouter.post("/aaa", async (ctx) => {
    console.log(ctx.body);
    ctx.body = await ctx.app.people.insert(ctx.request.body);
});

// Update one
securedRouter.put("/people/:id", async (ctx) => {
    let documentQuery = {"_id": ObjectID(ctx.params.id)}; // Used to find the document
    let valuesToUpdate = ctx.request.body;
    ctx.body = await ctx.app.people.updateOne(documentQuery, valuesToUpdate);
});

// Delete one
securedRouter.delete("/people/:id", async (ctx) => {
    let documentQuery = {"_id": ObjectID(ctx.params.id)}; // Used to find the document
    ctx.body = await ctx.app.people.deleteOne(documentQuery);
});

// app.use(router.routes()).use(router.allowedMethods());
// app.use(securedRouter.routes()).use(securedRouter.allowedMethods());
app.listen(3001);