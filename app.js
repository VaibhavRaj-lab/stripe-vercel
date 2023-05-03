require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 8080;
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.static("."));
const YOUR_DOMAIN = process.env.DOMAIN;
app.get("/get", async (req, res) => {
  console.log("here=>>>>", req.query.id);
  const session = await stripe.checkout.sessions.retrieve(req.query.id);
  console.log(session);
  res.json({ session: session });
});
app.post("/create", async (req, res) => {
  const { price, qauntity, basket } = req.body;
  console.log(qauntity);
  const session = await stripe.checkout.sessions
    .create({
      payment_method_types: ["card"],
      line_items: [
        {
          // TODO: replace this with the `price` of the product you want to sell

          price_data: {
            currency: "inr",
            product_data: {
              name: "blue",
            },
            unit_amount: (price * 100) / 2,
          },

          quantity: qauntity,
        },
      ],
      metadata: {
        basket:
          "THANK YOU FOR YOUR PURCHASE. WE WILL KINDLY PROCEED YOUR ORDER asdas d",
      },
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success?id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    })
    .then((session) => {
      console.log(session.id);
      return res.status(200).json({
        session: session.id,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.listen(port, () => console.log("Running on port 4242"));
