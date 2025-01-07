const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 4001;
const calculateCrossRate = require("./calculateCrossRate.js");
const refactorResponse = require("./refactorResponse.js");

// Middleware to parse request body
app.use(express.json());

// Middleware to validate request data
app.use((req, res, next) => {
  const { currencyPairs, startDate, endDate } = req.body;

  if (
    !currencyPairs ||
    !Array.isArray(currencyPairs) ||
    currencyPairs.length === 0
  ) {
    return res.status(400).json({
      error:
        "Invalid currencyPairs. Please provide an array of currency pairs.",
    });
  }

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "Please provide both startDate and endDate." });
  }

  next();
});

// Middleware to get format parameter from URL
app.param("format", (req, res, next, format) => {
  if (format !== "json" && format !== "xml") {
    return res.status(400).send('Invalid format. Please use "json" or "xml".');
  }
  req.format = format || "json";
  next();
});

// Route that retrieves exchange rates for each currency pair
app.post("/getExchangeRates/:format?", async (req, res) => {
  try {
    const { currencyPairs, startDate, endDate } = req.body;
    const responses = [];

    for (const pair of currencyPairs) {
      const [baseCurrency, targetCurrency] = pair.split("/");
        console.log(baseCurrency,targetCurrency);
      if (baseCurrency === "EUR") {
        // Case 1: XXX/EUR
        const ecbData = await requestToEcb(targetCurrency, startDate, endDate);
        responses.push(refactorResponse(ecbData));
      } else if (targetCurrency === "EUR") {
        // Case 2: EUR/YYY
        const ecbData = await requestToEcb(baseCurrency, startDate, endDate);
        const refactoredEcbData = refactorResponse(ecbData);
        const invertedRates = refactoredEcbData.observations.map((obs) => ({
          ...obs,
          rate: (1 / parseFloat(obs.rate)).toFixed(4),
        }));
        responses.push({
          ...refactoredEcbData,
          observations: invertedRates,
        });
      } else {
        // Case 3: ZZZ/XXX
        const ecbData1 = await requestToEcb(baseCurrency, startDate, endDate);
        const ecbData2 = await requestToEcb(targetCurrency, startDate, endDate);
        const crossRate = calculateCrossRate(
          refactorResponse(ecbData1),
          refactorResponse(ecbData2)
        );
        responses.push(crossRate);
      }
    }

    res.json(responses);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch exchange rates" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});

async function requestToEcb(targetCurrency, startDate, endDate) {
  const ecbUrl = `https://data-api.ecb.europa.eu/service/data/EXR/D.${targetCurrency}.EUR.SP00.A`;
  const url = `${ecbUrl}?startPeriod=${startDate}&endPeriod=${endDate}&detail=dataonly&format=jsondata`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching data for ${targetCurrency}: ${error.message}`
    );
  }
}
