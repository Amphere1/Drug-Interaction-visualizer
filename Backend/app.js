import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";
import authRoutes from './routes/auth.js';
import "./config/passport.js";
import cors from 'cors';
import verifyToken from './middleware/auth.js';
import { checkInteractions } from "./genkit/interactions.js";
import fs from 'fs';
import fetch from 'node-fetch';
import bookmarkRoutes from './routes/bookmark.js'

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
app.use('/api/bookmarks', bookmarkRoutes);

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


// drug information endpoint

app.post("/api/drugs/search", verifyToken, async (req, res) => {
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

// drug Interaction endpoint
app.post("/api/drugs/interaction", verifyToken, async (req, res) => {
  const drugInput = req.body.drugName; // Can be a single name or an array of names

  if (!drugInput || !Array.isArray(drugInput)) {
    return res.status(400).json({ error: "drugName must be an array of up to 10 items." });
  }

  if (drugInput.length > 10) {
    return res.status(400).json({ error: "You can only check up to 10 drugs at a time." });
  }

  try {
    const formattedDrugs = [];

    for (const drug of drugInput) {
      const response = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(drug)}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const firstResult = data.results[0];

        formattedDrugs.push({
          name: firstResult.openfda?.generic_name?.[0] || drug,
          purpose: firstResult.purpose || [],
          interactions: firstResult.drug_interactions || [],
          warnings: firstResult.warnings || [],
          description: firstResult.description?.[0] || '',
        });
      }
    }

    // Genkit Flow
    const interactionResult = await checkInteractions(formattedDrugs);

    res.json({
      drugs: formattedDrugs,
      interactions: interactionResult,
    });
  } catch (error) {
    console.error("Error in /api/drugs:", error);
    res.status(500).json({ error: "Failed to fetch or analyze drug data" });
  }
});


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('MongoDB connection error:', error));


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});