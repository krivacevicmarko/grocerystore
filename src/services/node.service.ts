import mongoose from "mongoose"
import Node from "../models/Node"
import {AppError} from "../utils/AppError"

export const getNodeAndDescendantIds = async (nodeId: string): Promise<mongoose.Types.ObjectId[]> => {
    const result = await Node.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(nodeId)}
        },
        {
            $graphLookup: {
                from: "nodes",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parent",
                as: "descendants",
            },
        },
    ]);

    if(!result || result.length === 0) {
        throw new AppError("Node not found", 404);
    }

    const root = result[0];

    return [
        root._id,
        ...root.descendants.map((d: any) => d._id)
    ];
};