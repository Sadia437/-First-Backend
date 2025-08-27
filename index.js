const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = 7000;
app.use(cors(
    // origin: 'http://localhost:5173'
));
app.use(express.json())

const uri = "mongodb+srv://test:xGS79FDHVcYQI8Rn@cluster0.amfxxji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function bootstrap() {
    try {
        await client.connect();
        const database = client.db('First-database')
        const userCollection = database.collection('Users');

        // single user
        app.get('/users/:userId', async (req, res) => {
            const id = req.params.userId;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        // get=read
        app.get('/users', async (req, res) => {
            const query = {};
            const back = await userCollection.find(query).toArray();
            res.send(back)
        })

        // post=create
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        // update user
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const query = { _id: new ObjectId(id) }
            const option = { upsert: true }

            const updatedDoc = {
                $set: {
                    name: user.name,
                    email: user.email,
                    age: user.age,
                    education: user.education
                }
            }
            const result = await userCollection.updateOne(query, updatedDoc, option);
            res.send(result)

        })

        // delete
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })

    } finally {
        // await client.close();
    }
}
bootstrap().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Home Route')
})

app.listen(port, () => {
    console.log(`Our Backend Run On: ${port}`);

})










