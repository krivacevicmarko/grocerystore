import bcrypt from "bcrypt"
import User, {IUser} from "../models/User"
import {createToken} from "../utils/jwt.utils"
import {LoginDto} from "../dto/auth.dto"

export const loginUser = async (dto: LoginDto): Promise<{user: IUser, token: string} | null> => {
    const {username, password} = dto;

    const user = await User.findOne({username});
    if(!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return null;

    const token = createToken({
        id: user._id.toString(),
        role: user.role,
    });

    return {user, token};
};