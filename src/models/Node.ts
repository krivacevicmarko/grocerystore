import mongoose, {Document, Types} from "mongoose"

export interface INode extends Document {
    name: string,
    parent: Types.ObjectId | null;
}

const nodeSchema = new mongoose.Schema<INode>({
    name: { type: String, required: true, unique: true},
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Node",
        default: null,
    },
});

const Node = mongoose.model<INode>("Node", nodeSchema);
export default Node;