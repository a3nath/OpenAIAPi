import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(config);




app.get('/', async (req, res) => {
    res.status(200).send({
        message: "Hello there"
    })
})

app.post('/', async(req, res) => {
    try {
        //propmt is user submitted question - data we give to the server from the front end
        const p = req.body.prompt;
        // what server gives back
        const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${p}`,
        temperature: 0,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0
        });
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({error})
        
    }
})

app.listen(5000, ()=> console.log('Server is running on port http://localhost:5000'));

