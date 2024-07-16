import passport from 'passport';
import { Strategy as LocalStrategy, IStrategyOptionsWithRequest, VerifyFunctionWithRequest } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import mongoose from 'mongoose';
import User, { IUser } from '../models/userModel';

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: 'identifier', // can be email or phone number
//       passwordField: 'password',
//       passReqToCallback: true, // pass the request to the callback
//     } as IStrategyOptionsWithRequest,
//     async (req, identifier: string, password: string, done: (error: any, user?: IUser | false, info?: any) => void) => {
//       try {
//         const user: IUser | null = await User.findOne({
//           $or: [{ email: identifier }, { phoneNumber: identifier }],
//         });
//         if (!user) {
//           return done(null, false, { message: 'Incorrect identifier or password.' });
//         }
//         const isMatch = await user.comparePassword(password);
//         if (!isMatch) {
//           return done(null, false, { message: 'Incorrect identifier or password.' });
//         }
//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// const opts: StrategyOptions = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret',
// };

// passport.use(
//   new JwtStrategy(opts, async (jwtPayload: any, done: VerifiedCallback) => {
//     try {
//       const user: IUser | null = await User.findById(jwtPayload.id);
//       if (user) {
//         return done(null, user);
//       } else {
//         return done(null, false);
//       }
//     } catch (err) {
//       return done(err, false);
//     }
//   })
// );
