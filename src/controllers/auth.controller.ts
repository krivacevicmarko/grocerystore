import {Request, Response, NextFunction} from "express"
import {plainToInstance } from "class-transformer"
import {validate} from "class-validator"
import {loginUser} from "../services/auth.service"
import {LoginDto} from "../dto/auth.dto"

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const dto = plainToInstance(LoginDto, req.body);
        const errors = await validate(dto);
        if (errors.length > 0) {
            res.status(400).json(errors);
            return;
        }

        const result = await loginUser(dto);
        if(!result) {
            res.status(401).json({ message: "Invalud username or password"});
            return;
        }

        res.status(200).json({
            token: result.token,
            user: {
                id: result.user._id,
                username: result.user.username,
                role: result.user.role,
            },
        });
    } catch (err) {
        next(err);
    }
};
