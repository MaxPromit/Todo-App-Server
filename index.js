const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 4000;
require("dotenv").config();

// middlewear

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ofikfyh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
  try {

    const addTaskCollection = client.db("Todo").collection("add-task");
    const completeTaskCollection = client.db("Todo").collection("complete-task");
    const commentCollection = client.db("Todo").collection("comment-post");

    app.post("/add-task", async (req, res) => {
        const task = req.body;
        console.log(task)
        const result = await addTaskCollection.insertOne(task);
        res.send(result);
      });
    //   comment post 
    // app.post("/commentPost", async (req, res) => {
    //     const comment = req.body;
    //     console.log(comment)
    //     const result = await commentCollection.insertOne(comment);
    //     res.send(result);
    //   });

      app.get('/commentPost', async(req,res)=>{
        const email = req.query.email;
        const query = {email}
        const result = await commentCollection.find(query).toArray();
        res.send(result)
    })

    app.put('/commentPost', async(req,res)=>{

        const email = req.body.email;
        const comment = req.body.commentField;
        console.log(email,comment)

        const filter = {email: email};
        const option = {upsert: true}
        const updateDoc = {
            $set: {
                commentField: comment
            }
        }
        const result = await commentCollection.updateOne(filter,updateDoc,option)
        res.send(result)
    })


    //   complete task
    app.post("/complete-task", async (req, res) => {
        const task = req.body;
        console.log(task)
        const result = await completeTaskCollection.insertOne(task);
        res.send(result);
      });

      app.get('/complete-task', async(req,res)=>{
        const email = req.query.email;
        const query = {email}
        const result = await completeTaskCollection.find(query).toArray();
        res.send(result)
    })

    app.delete('/complete-task/:id', async(req,res)=>{
        const id = req.params.id;
        console.log(id);
        const query = {_id: ObjectId(id)};
        const result = await completeTaskCollection.deleteOne(query)
        console.log(result)
        res.send(result)
    })
    // add task
      app.get('/reviews', async(req,res)=>{
        const email = req.query.email;
        const query = {email}
        const result = await addTaskCollection.find(query).toArray();
        res.send(result)
    })

    app.patch("/reviews/:id", async (req, res) => {
        const id = req.params.id;
        const message = req.body.message;
        const query = { _id: ObjectId(id) };
        const updatedDoc = {
          $set: {
              message: message
          }
        }
        const result = await addTaskCollection.updateOne(query,updatedDoc)
        res.send(result)
  
      });

    app.delete('/reviews/:id', async(req,res)=>{
        const id = req.params.id;
        console.log(id);
        const query = {_id: ObjectId(id)};
        const result = await addTaskCollection.deleteOne(query)
        console.log(result)
        res.send(result)
    })

  } finally {

  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("To Do Server Is Running");
});

app.listen(port, () => {
  console.log("To Do Server Is Running On", port);
});
