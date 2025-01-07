const  calculateCrossRate= function calculateCrossRate(baseCurrencyReference, targetCurrencyObject) {
    if (baseCurrencyReference.baseCurrency !== targetCurrencyObject.baseCurrency) {
      throw new Error("Base currencies do not match for cross-rate calculation.");
    }
  
    return {
      baseCurrency: baseCurrencyReference.currency,
      currency: targetCurrencyObject.currency,
      observations: baseCurrencyReference.observations.map((refObservation, index) => ({
        date: refObservation.date,
        rate: (targetCurrencyObject.observations[index].rate / refObservation.rate).toFixed(4) 
      }))
    };
  }


module.exports = calculateCrossRate;
