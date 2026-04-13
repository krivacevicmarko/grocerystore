import {Response, NextFunction} from "express"
import {plainToInstance} from "class-transformer"
import {validate} from "class-validator"
import * as userService from "../services/user.service"
import {CreateUserDto, UpdateUserDto} from "../dto/user.dto"
import {AuthRequest} from "../middleware/auth.middleware"
import {AppError} from "../utils/AppError"
import {getParamAsString} from "../utils/helpers"

export const createUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const dto = plainToInstance(CreateUserDto, req.body);
        const errors = await validate(dto);
        if(errors.length > 0) {
            res.status(400).json(errors);
            return;
        }

        const user = await userService.createUser(dto);
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
};

export const getUserById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = getParamAsString(req.params.id, "User ID");
        const user = await userService.getUserById(id);
        if(!user) throw new AppError("User not found",404);
        res.status(200).json(user);
    } catch(err) {
        next(err);
    }
};

export const updateUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = getParamAsString(req.params.id, "User ID");
        const dto = plainToInstance(UpdateUserDto, req.body);
        const errors = await validate(dto);
        if (errors.length > 0) {
            res.status(400).json(errors);
            return;
        }

        const updated = await userService.updateUser(id, dto);
        if (!updated) throw new AppError("User not found", 404);
        res.status(200).json(updated);
    } catch(err) {
        next(err);
    }
};

export const deleteUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = getParamAsString(req.params.id, "User ID");
        const deleted = await userService.deleteUser(id);
        if (!deleted) throw new AppError("User not found", 404);
        res.status(200).json({ message: "User deleted successfully"});
    } catch (err) {
        next(err);
    }
};

export const getEmployeesForNode = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if(!req.user) throw new AppError("Unauthorized", 401);
        const nodeId = req.query.nodeId
            ? String(req.query.nodeId)
            : req.user.nodeId.toString();
        
        const users = await userService.getEmployeesForNode(nodeId);
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
};

export const getEmployeesForNodeAndDescendants = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) throw new AppError("Unauthorized", 401);

        const nodeId = req.query.nodeId
            ? String(req.query.nodeId)
            : req.user.nodeId.toString();
        
            const users = await userService.getEmployeesForNodeAndDescendants(nodeId);
            res.status(200).json(users);
    } catch (err) {
        next(err);
    }
};

export const getManagersForNode = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if(!req.user) throw new AppError("Unauthorized", 401);

        const nodeId = req.query.nodeId
            ? String(req.query.nodeId)
            : req.user.nodeId.toString();
        
        const users = await userService.getManagersForNode(nodeId);
        res.status(200).json(users);
    } catch(err) {
        next(err);
    }
};

export const getManagersForNodeAndDescendants = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if(!req.user) throw new AppError("Unauthorized", 401);

        const nodeId = req.query.nodeId
            ? String(req.query.nodeId)
            : req.user.nodeId.toString();
        
        const users = await userService.getManagersForNodeAndDescendants(nodeId);
        res.status(200).json(users);
    } catch(err) {
        next(err);
    }
};

