import { Request, response, Response, NextFunction } from "express";
import { IReqAuth } from "../../types/express";
const stripe = require('stripe')(`FLWPUBK-1c1e0cbdabe382254cca25dd5-X`);
// const stripe = require('stripe')(`${process.env.STRIPE_KEEY}`);


const paymentCtrl = {
  createPaymentIntent: async (req: IReqAuth, res: Response) => {

    if (!req.user){

        return res.status(401).json({ message: "Invalid Authentication." });
    }

    const { amount, currency, email, tx_ref } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata: { email, tx_ref },
          });
          res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ message: "Error upserting basic information" });
    }
  },

  verifyPayment: async (req: IReqAuth, res: Response) => {

    if (!req.user)
      return res.status(401).json({ message: "Invalid Authentication." });

    const { paymentIntentId } = req.params;

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
          // Payment is successful
        //   console.log('Payment verified successfully:', paymentIntent);
          res.json({ status: 'success', paymentIntent });
        } else {
          // Payment is not successful
        //   console.log('Payment not verified:', paymentIntent);
          res.status(200).json({ status: 'failed', paymentIntent });
        }
    } catch (error) {
      res.status(500).json({ message: "Error upserting basic information" });
    }
  },


  example: async (req: IReqAuth, res: Response) => {},
};

export default paymentCtrl;
