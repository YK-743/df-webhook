const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
  const queryResult = req.body.queryResult;
  const parameters = queryResult.parameters;

  let date = parameters.date;

  // Check if date is missing
  if (!date) {
    return res.json({
      followupEventInput: {
        name: "ASK_DATE",
      },
    });
  }

  // Date exists: confirm booking
  return res.json({
    fulfillmentText: `Cool! Your booking is set for ${date}.`,
  });
});

app.get("/", (req, res) => {
  res.send("Webhook is running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
