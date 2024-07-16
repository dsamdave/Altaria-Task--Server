import bcrypt from 'bcryptjs';


export const hashPassword = async (password: string, salt: number) => {

    return await bcrypt.hash(password, salt);
  
  }