// index.js
const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
process.env.DEBUG = "dialogflow:debug";

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  // Utility: check if date is valid & in the future
  function isValidFutureDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    // basic sanity
    if (isNaN(date.getTime())) return false;

    // Must be tomorrow or later (same-day bookings usually fail)
    if (date <= now) return false;

    return true;
  }

  // Handler for AskDate intent
  async function askDateHandler(agent) {
    const date = agent.parameters.date;

    if (!isValidFutureDate(date)) {
      agent.add("Hmm, that date doesn't look valid. Try giving me a future date like `15th November` or `next Monday`.");
      return;
    }

    // store in context for confirmation intent
    agent.setContext({
      name: "booking-details",
      lifespan: 5,
      parameters: {
        date
      }
    });

    agent.add(`Got it. You're going with **${date}**. Should I confirm this booking?`);
  }

  let intentMap = new Map();
  intentMap.set("AskDate", askDateHandler);

  agent.handleRequest(intentMap);
});
