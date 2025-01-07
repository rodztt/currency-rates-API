const refactorResponse=(data) =>{
    // Extract base and target currencies
    const baseCurrency = data.structure.dimensions.series.find(dim => dim.id === "CURRENCY_DENOM").values[0].id;
    const targetCurrency = data.structure.dimensions.series.find(dim => dim.id === "CURRENCY").values[0].id; 

    // Extract observations
    const observations = Object.entries(data.dataSets[0].series["0:0:0:0:0"].observations)
    .map(([index, observation]) => ({ 
      date: data.structure.dimensions.observation[0].values[index].id, 
      rate: observation[0],
    }));
    
    return {
      baseCurrency,
      currency: targetCurrency,
      observations,
    };
  };


module.exports = refactorResponse;