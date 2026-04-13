import mongoose, {Document, Schema, Types, Model} from "mongoose"

export type UserRole = "EMPLOYEE" | "MANAGER";

export interface IUser extends Document {
    username: string;
    password: string;
    role: UserRole;
    nodeId: Types.ObjectId;
}

const userSchema = new Schema<IUser>({
    username: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    role: {type: String, enum: ["EMPLOYEE", "MANAGER"], required: true},
    nodeId: {type: Schema.Types.ObjectId, ref: "Node", required: true},
});

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;