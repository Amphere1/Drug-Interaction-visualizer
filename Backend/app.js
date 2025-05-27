import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";
import authRoutes from './routes/auth.js';
import "./config/passport.js";
import cors from 'cors';
import verifyToken from './middleware/auth.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('Server is working correctly');
});

app.use('/api/auth', authRoutes);


//search routes will be added here

// Local drugs.json endpoint
app.get("/api/drugs/local", (req, res) => {
  try {
    const data = fs.readFileSync("Backend/drugsName.json", "utf-8");
    const drugList = JSON.parse(data);
    res.json(drugList);
    // res.send(json(drugList))
  } catch (err) {
    res.status(500).json({ error: "Failed to read drug data" });
  }
});

// FDA API endpoint
app.post("/api/drugs", async (req, res) => {
  const drugInput = req.body.drugName; 
  if (!drugInput) {
    return res.status(400).json({ error: "Missing drugName in request body" });
  }
  try {
    const response = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(drugInput)}`);
    const data = await response.json();
    let drugs = {};
    if (data.results) {
      data.results.forEach(element => {
        if (element.openfda) {
          drugs = {
            generic_name: element.openfda.generic_name || [],
            brand_name: element.openfda.brand_name || [],
            rxcui: element.openfda.rxcui || [],
            purpose: element.purpose || [],
            dosage_and_administration: element.dosage_and_administration || [],
            indications_and_usage: element.indications_and_usage || [],
            active_ingredient: element.active_ingredient || [],
            inactive_ingredient: element.inactive_ingredient || [],
            storage_and_handling: element.storage_and_handling || [],
          };
        }
      });
    }
    console.log(drugs);
    res.json(drugs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch drug data" });
  }
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('MongoDB connection error:', error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});