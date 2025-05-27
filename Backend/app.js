// server/index.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // Add this line to parse JSON bodies

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
// app.get('/api/drugs',(res,req)=>{
//   res.json(drugs)
// })

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
