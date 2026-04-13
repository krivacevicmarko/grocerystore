import {Request, Response, NextFunction} from "express"
import User, {IUser} from "../models/User"
import {verifyToken} from "../utils/jwt.utils"
import mongoose from "mongoose"
import {getNodeAndDescendantIds} from "../services/node.service"
import {AppError} from "../utils/AppError"

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    const user = await User.findById(payload.id);
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        message: "You don't have permission for this operation",
      });
      return;
    }
    next();
  };
};

export const authorizeNodeAccess = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const allowedNodeIds = await getNodeAndDescendantIds(
      req.user.nodeId.toString()
    );

    const allowedNodeStrings = allowedNodeIds.map((id: mongoose.Types.ObjectId) => id.toString());

    let targetNodeId: string | null = null;

    if (req.method === "POST") {
      targetNodeId = req.body.nodeId;
      if (!targetNodeId) {
        res.status(400).json({ message: "nodeId is required" });
        return;
      }
    } else if (req.method === "PUT" || req.method === "DELETE") {
      const targetUser = await User.findById(req.params.id).select("nodeId");
      if (!targetUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      targetNodeId = targetUser.nodeId.toString();
    } else if (req.method === "GET" && req.params.id) {
      const targetUser = await User.findById(req.params.id).select("nodeId");
      if (!targetUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      targetNodeId = targetUser.nodeId.toString();
    } else {
      next();
      return;
    }

    if (!allowedNodeStrings.includes(targetNodeId)) {
      res.status(403).json({
        message: "You don't have permission to manage users on this node",
      });
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
};