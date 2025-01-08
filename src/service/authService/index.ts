import Users from "../../models/userModel";
import {
  LoginUserParams,
  RegisterUserParams,
  UserInfoParams,
} from "../../types/servicesTypes";

const authService = {

  registerUser: async ({
    name,
    email,
    phoneNumber,
    password,

  }: RegisterUserParams) => {
    const existingUser = await Users.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      throw new Error("User account already exists");
    }

    const user = new Users({ name, email, phoneNumber, password });
    await user.save();

    return user;
  },

  loginUser: async ({ identifier, password }: LoginUserParams) => {
    const user = await Users.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }],
    });

    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid credentials");
    }

    return { user };
  },


  retrieveUserInfo: async ({ id }: UserInfoParams) => {
    const user = await Users.findById(id);

    if (!user) {
      throw new Error("User account not found.");
    }

    return { user };
  },
};

export default authService;
