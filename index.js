const express = require("express");
const { WebhookClient } = require("dialogflow-fulfillment");

const app = express();
app.use(express.json());

function isValidFutureDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  if (isNaN(date.getTime())) return false;
  if (date <= now) return false;

  return true;
}

async function askDateHandler(agent) {
  const date = agent.parameters.date;

  if (!isValidFutureDate(date)) {
    agent.add("Hmm, that date doesn't look valid. Try giving me a future date like `15th November` or `next Monday`.");
    return;
  }

  agent.setContext({
    name: "booking-details",
    lifespan: 5,
    parameters: {
      date
    }
  });

  agent.add(`Got it. You're going with ${date}. Should I confirm this booking?`);
}

app.post("/webhook", (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  let intentMap = new Map();
  intentMap.set("AskDate", askDateHandler);

  agent.handleRequest(intentMap);
});

// Render will inject PORT automatically
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
