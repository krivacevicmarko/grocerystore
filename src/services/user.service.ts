import bcrypt from "bcrypt"
import User, {IUser} from "../models/User"
import {CreateUserDto, UpdateUserDto} from "../dto/user.dto"
import {getNodeAndDescendantIds} from "./node.service"
import {AppError} from "../utils/AppError"

export const createUser = async (dto: CreateUserDto): Promise<IUser> => {
    const existingUser = await User.findOne({username: dto.username});
    if(existingUser){
        throw new AppError("Username already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return await User.create({
        username: dto.username,
        password: hashedPassword,
        role: dto.role,
        nodeId: dto.nodeId,
    });
};

export const getUserById = async (id:string): Promise<IUser | null> => {
    return await User.findById(id).populate("nodeId");
};

export const updateUser = async (
    id: string,
    dto: UpdateUserDto
): Promise<IUser | null> => {
    const user = await User.findById(id);
    if (!user) throw new AppError("User not found", 404);
    if (dto.password) {
        dto.password = await bcrypt.hash(dto.password, 10);
    }

    return await User.findByIdAndUpdate(id, dto, {new: true}).populate("nodeId");
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
    const user = await User.findById(id);
    if(!user) throw new AppError("User not found",404);

    return await User.findByIdAndDelete(id);
};

export const getEmployeesForNode = async (nodeId: string): Promise<IUser[]> => {
    return await User.find({
        nodeId,
        role: "EMPLOYEE"
    }).populate("nodeId");
};

export const getEmployeesForNodeAndDescendants = async (nodeId: string): Promise<IUser[]> => {
    const nodeIds = await getNodeAndDescendantIds(nodeId);
    return await User.find({
        nodeId: {$in:nodeIds},
        role: "EMPLOYEE",
    }).populate("nodeId");
};

export const getManagersForNode = async (nodeId: string): Promise<IUser[]> => {
    return await User.find({
        nodeId,
        role: "MANAGER",
    }).populate("nodeId");
}

export const getManagersForNodeAndDescendants = async (nodeId: string): Promise<IUser[]> => {
    const nodeIds = await getNodeAndDescendantIds(nodeId);
    return await User.find({
        nodeId: {$in: nodeIds },
        role: "MANAGER",
    }).populate("nodeId");
};


