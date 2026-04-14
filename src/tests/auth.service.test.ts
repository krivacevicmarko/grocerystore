import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server"
import bcrypt from "bcrypt"
import User from "../models/User"
import Node from "../models/Node"
import {loginUser} from "../services/auth.service"

let mongoServer: MongoMemoryServer;
let testNode: any;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  testNode = await Node.create({ name: "TestNode", parent: null });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("Auth Service — loginUser", () => {
  it("returns user and token when credentials are correct", async () => {
    const hashed = await bcrypt.hash("test0707", 10);
    await User.create({
      username: "testuser",
      password: hashed,
      role: "EMPLOYEE",
      nodeId: testNode._id,
    });

    const result = await loginUser({ username: "testuser", password: "test0707" });

    expect(result).not.toBeNull();
    expect(result?.user.username).toBe("testuser");
    expect(typeof result?.token).toBe("string");
  });

  it("returns null when user does not exist", async () => {
    const result = await loginUser({ username: "doesnotexist", password: "test0707" });
    expect(result).toBeNull();
  });

  it("returns null when password is not correct", async () => {
    const hashed = await bcrypt.hash("test0707", 10);
    await User.create({
      username: "testuser",
      password: hashed,
      role: "EMPLOYEE",
      nodeId: testNode._id,
    });

    const result = await loginUser({ username: "testuser", password: "wrongpass" });
    expect(result).toBeNull();
  });

  it("returns null when password is empty string", async () => {
    const result = await loginUser({ username: "testuser", password: "" });
    expect(result).toBeNull();
  });

  it("reeturns null when username is empty string", async () => {
    const result = await loginUser({ username: "", password: "test0707" });
    expect(result).toBeNull();
  });
});
