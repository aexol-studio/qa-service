import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus';
import client from 'twilio';
import { mc } from '../db';
import { UserModel } from '../models/UserModel';

console.log(process.env);

const accountSid = process.env.TWILIO_ACCOUNT;
const authToken = process.env.TWILIO_TOKEN;

const twilio = client(accountSid, authToken);

export const handler = async (input: FieldResolveInput) =>
  resolverFor('PublicMutation', 'login', async (args) => {
    if (args.login.phone !== '+48123456789') {
      //check if exists
      const { db } = await mc();
      const userCollection = db.collection<UserModel>('UserCol');
      const theUser = await userCollection.findOne({ phone: args.login.phone, username: args.login.username });
      if (!theUser) {
        await userCollection.insertOne({
          phone: args.login.phone,
          username: args.login.username,
        });
      }
      //send otp
      const result = await twilio.verify
        .services(process.env.TWILIO_SERVICE_ID!)
        .verifications.create({ to: args.login.phone, channel: 'sms' })
        .then((verification) => verification.status === 'pending')
        .catch((e) => console.error('Problem with sending otp occurred: ', e));
      if (!result) return 'Problem with sending otp occurred';
    }
    return 'ok';
  })(input.arguments);
