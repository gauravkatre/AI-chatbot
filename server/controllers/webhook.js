import Stripe from "stripe";
import Transaction from "../models/transactionModel.js";
import User from "../models/userModel.js";

export const stripeWebhooks = async (request, response) => {

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const sig = request.headers["stripe-signature"];
  let event;

  // ✅ Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return response
      .status(400)
      .send(`Webhook Error: ${error.message}`);
  }

  // ✅ Your logic (fixed, same structure)
  try {

    switch (event.type) {

      case "payment_intent.succeeded": {

        const paymentIntent = event.data.object;

        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessionList.data[0];

        if (!session || !session.metadata) {
          console.log("No session metadata found");
          break;
        }

        const { transactionId, appId } = session.metadata;

        if (appId === 'quickgpt') {

          const transaction = await Transaction.findOne({
            _id: transactionId,
            isPaid: false
          });

          if (transaction) {

            // Update credits in user account
            await User.updateOne(
              { _id: transaction.userId },
              { $inc: { credits: transaction.credits } }
            );

            // Update credit Payment status
            transaction.isPaid = true;
            await transaction.save();

          }

        } else {

          return response.json({
            received: true,
            message: "Ignored event: Invalid app"
          });

        }

        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
        break;
    }

    // ✅ Always respond to Stripe
    response.json({ received: true });

  } catch (error) {

    console.error("Webhook processing error:", error);
    response.status(500).send("Internal Server Error");

  }
};