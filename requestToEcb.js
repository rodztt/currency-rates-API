const refactorResponse = require("./refactorResponse.js");
const axios = require('axios');
let reorganizedData;

const requestToEcb = async (targetCurrency, startDate, endDate) => {
  const ecbUrl = `https://data-api.ecb.europa.eu/service/data/EXR/D.${targetCurrency}.EUR.SP00.A`;
  const url = `${ecbUrl}?startPeriod=${startDate}&endPeriod=${endDate}&detail=dataonly&format=jsondata`;
  try {
    const response = await axios.get(url);
    const data = response.data;
    reorganizedData = refactorResponse(data);
    console.log(reorganizedData);
    //res.json(reorganizedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    //res.status(500).json({ error: "Failed to fetch exchange rates" });
  }
};

module.exports=refactorResponse;
