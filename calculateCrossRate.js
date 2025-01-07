//this functions is used to calculate ,using two responses from the ECB API as inout, new exchange rates with differente
//base currency than EUR

function toFixedNumber(num, digits, base){
  const pow = Math.pow(base ?? 10, digits);
  return Math.round(num*pow) / pow;
}

const  calculateCrossRate= function calculateCrossRate(baseCurrencyReference, targetCurrencyObject) {
    if (baseCurrencyReference.baseCurrency !== targetCurrencyObject.baseCurrency) {
      throw new Error("Base currencies do not match for cross-rate calculation.");
    }
  
    return {
      baseCurrency: baseCurrencyReference.currency,
      currency: targetCurrencyObject.currency,
      observations: baseCurrencyReference.observations.map((refObservation, index) => ({
        date: refObservation.date,
        rate: Math.round( (targetCurrencyObject.observations[index].rate / refObservation.rate) * 1e4 ) / 1e4 //rounds the number 4 decimals. To fixed was outputing string
      }))
    };
  }

module.exports = calculateCrossRate;
