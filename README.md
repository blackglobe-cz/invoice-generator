Black Globe's Invoice Generator
=====================

Simple app for generating and saving invoices.

Optimized for Czech Republic.

At the moment this app is prepared to be used in two different ways:

 - with a running server (e.g. on http://localhost:7000)
 - as a plain old html file (e.g. on C:/Programs/invoice-generator/dist/index.html)

At the moment, the application saves all your data to **LocalStorage**, so it doesn't really matter, which option you choose.
However, if you feel like you have nothing to do, you can write an API server with DB and connect the app. The app is more or less prepared for that.

### Run with

```
npm install
npm start
```

Browser should open automatically. If not, go to localhost:7000