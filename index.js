const express = require("express");
const app = express();

app.use(express.json());

app.post("/webhook", (req, res) => {
  const date = req.body.sessionInfo?.parameters?.date;

  if (!date) {
    return res.json({
      fulfillment_response: {
        messages: [{ text: { text: ["Send a date plz 😭"] } }]
      }
    });
  }

  const now = new Date();
  const userDate = new Date(date);

  if (userDate < now) {
    return res.json({
      fulfillment_response: {
        messages: [{ text: { text: ["That date already passed 💀"] } }]
      }
    });
  }

  return res.json({
    fulfillment_response: {
      messages: [{ text: { text: ["Date is valid ✅"] } }]
      }
    });
});

app.listen(3000, () => console.log("✅ Webhook live on 3000"));
