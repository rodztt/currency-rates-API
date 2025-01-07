# currency-rates-API

This REST API provides daily exchange rates for different currency pairs based on rates published by the European Central Bank (ECB) API. The API should be implemented in Node.js and accept input in JSON or XML formats, with the output format configurable via a format parameter in the URL.

# How to use it

## Register

First the end-user must send a POST request to the following endpoint to register:

/register

With the following information in JSON format with the following information:

{
  "username": <your_username>,
  "password": <your_password>>
}

The API should send back 201 status and the message "User registered"

## Login

The user must then Login in the API using the following endpoint:

/login

The following body request must be sent:

{
  "username": <your_username>,
  "password": <your_password>>
}

Server will send back the 201 code with the following information:

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNzM2MjYyNTAwLCJleHAiOjE3MzYyNjYxMDB9.UypSHXKEqUFbWfakiUm8xVIhKq_46MA2CyFpKfu3f1I"
}


This is the JWT token, (1h expiration), that user must use to make requests to get exchangeRates.

## Get Exchange Rates
The app accepts requests both in JSON and XML formats. The endpoint to get the exchange rates are:

getExchangeRates/:format?

Format is optional parameter to determine the output format. JSON format is default but also accepts xml value as following:

getExchangeRates/xml

The body request must have the following information:

*currencyPairs: Array containing string elements with the following structure: "EUR/DOL" => "EUR" is the base currency and "DOL" is the target currency;

*startDate: Starting date for the dataset. Should be in the following formtat "YYYY-DD-MM";

*endDate: End date for the dataset. Should be in the following formtat "YYYY-DD-MM";

*Authentication header with the JWT token received on login.

The following are examples to make a request to the API:

JSON Body request:

{ "currencyPairs": [ "USD/BRL", "EUR/USD", "BRL/JPY" ], "startDate": "2009-05-04", "endDate": "2009-05-20" }

XML Body request:

<?xml version="1.0" encoding="UTF-8"?> <request> <currencyPairs> <pair>USD/BRL</pair> <pair>EUR/USD</pair> <pair>BRL/JPY</pair> </currencyPairs> <startDate>2009-05-04</startDate> <endDate>2009-05-20</endDate> </request>