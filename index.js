require("dotenv").config();
const express = require("express");
const { TextServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const MODEL_NAME = "models/text-bison-001";

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/formataddr", async (req, res) => {
  const input = req.body.input;
  console.log(input);
  const promptString = `You will be given an address, you should make deductions about information such as the customer first and last name, the Title, the country, the state, the city, the zipcode, and do not forget to add a Title of Mr or Mrs. based on the name provided. Output this data in a JSON format.
Examples:
Input: Mr. John W. Doe Boulevard du Pont-d'Arve 25b 12000 Paris FR
{
 "Title": "Mr.",
 "FirstName": "John",
 "MiddleName": "W.",
 "LastName": "Doe",
 "Street": "Boulevard du Pont-d'Arve",
 "HouseNumber": "25b",
 "Zip": "F-12000",
 "City": "Paris",
 "Country": "FR"
}
Input: Microsoft LLC - 12-19 Broadway Street, 98001 Washington
Output: {
 "Name": "Microsoft LLC",
 "Street": "Broadway Street",
 "HouseNumber": "12-19",
 "Zip": "98001",
 "City": "Washington",
 "Country": "United States"
}
Input: Suite 4A, Springfield, IL 6270, 123 Elm Street, Emilly Johnson
{
 "Title": "Mrs.",
 "Name": "Emilly ",
 "LastName": "Johnson",
 "Street": "123 Elm Street",
 "HouseNumber": "Suite 4A",
 "Zip": "6270",
 "City": "Springfield",
 "State": "Illinois",
 "Country": "United States"
}
Input: 94101, 456 Oak Avenue, Apt 7B, SF, CA 
{
 "Zip": "94101",
 "Street": "456 Oak Avenue",
 "HouseNumber": "Apt 7B",
 "Apt": "7B",
 "City": "San Francisco",
 "State": "California",
 "Country": "United States"
}
Input: Alice Dupont Merille, 37 Rue de la République, Paris, France
{
 "Title": "Mrs.",
 "FirstName": "Alice",
 "MiddleName": "Merille",
 "LastName": "Doe",
 "Street": "Rue de la République ",
 "HouseNumber": "37",
 "City": "Paris",
 "Country": "France"
}
Input: 56 Tverskaya Street, Mosceow Russia, Viktor Petrov
{
 "Title": "Mr.",
 "FirstName": "Viktor",
 "MiddleName": "Petrov",
 "Street": "Tverskaya Street",
 "HouseNumber": "56",
 "City": "Mosceow",
 "Country": "Russia"
}
Input: ${input}
`;
  const stopSequences = [];
  client
    .generateText({
      model: MODEL_NAME,
      temperature: 0.7,
      candidateCount: 1,
      top_k: 40,
      top_p: 0.95,
      max_output_tokens: 1024,
      stop_sequences: stopSequences,
      safety_settings: [
        { category: "HARM_CATEGORY_DEROGATORY", threshold: 1 },
        { category: "HARM_CATEGORY_TOXICITY", threshold: 1 },
        { category: "HARM_CATEGORY_VIOLENCE", threshold: 2 },
        { category: "HARM_CATEGORY_SEXUAL", threshold: 2 },
        { category: "HARM_CATEGORY_MEDICAL", threshold: 2 },
        { category: "HARM_CATEGORY_DANGEROUS", threshold: 2 },
      ],
      prompt: {
        text: promptString,
      },
    })
    .then((result) => {
      console.log("got res");
      res.send(result[0].candidates[0].output);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
