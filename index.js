require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lhckmem.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const quizCollection = client.db("AllQuiz").collection("QuizDetails");
    const checkCollection = client.db("AllQuiz").collection("CheckQuiz");

    // get all quiz
    app.get("/allQuiz/", async (req, res) => {
      const query = {};
      const singleQuiz = await quizCollection.find(query).toArray();
      res.send(singleQuiz);
    });

    // seen first quiz
    app.put("/seenQuiz/:id", async (req, res) => {
      const id = req.params.id;
      const seen = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: seen,
      };
      const result = await quizCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

   
    
  } finally {
  }
}

run().catch((err) => console.log(err));

app.get("/", async (req, res) => {
  res.send("Quiz live Test server is running");
});

app.listen(port, () => console.log(`Quiz live Test running on ${port}`));
