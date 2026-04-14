import mongoose from "mongoose"
import {MongoMemoryServer} from "mongodb-memory-server"
import Node from "../models/Node"
import {getNodeAndDescendantIds} from "../services/node.service"

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Node.deleteMany({});
});

describe("Node Service — getNodeAndDescendantIds", () => {
  it("returns only root when there are not descendants", async () => {
    const root = await Node.create({ name: "Srbija", parent: null });

    const ids = await getNodeAndDescendantIds(root._id.toString());
    const idStrings = ids.map((id: mongoose.Types.ObjectId) => id.toString());

    expect(idStrings).toContain(root._id.toString());
    expect(idStrings.length).toBe(1);
  });

  it("returns root and all descendants", async () => {
    const root = await Node.create({ name: "Srbija", parent: null });
    const child = await Node.create({ name: "Vojvodina", parent: root._id });
    const grandChild = await Node.create({ name: "Novi Sad", parent: child._id });

    const ids = await getNodeAndDescendantIds(root._id.toString());
    const idStrings = ids.map((id: mongoose.Types.ObjectId) => id.toString());

    expect(idStrings).toContain(root._id.toString());
    expect(idStrings).toContain(child._id.toString());
    expect(idStrings).toContain(grandChild._id.toString());
    expect(idStrings.length).toBe(3);
  });

  it("returns only child and all his descendants when asked from child", async () => {
    const root = await Node.create({ name: "Srbija", parent: null });
    const child = await Node.create({ name: "Vojvodina", parent: root._id });
    const grandChild = await Node.create({ name: "Novi Sad", parent: child._id });

    const ids = await getNodeAndDescendantIds(child._id.toString());
    const idStrings = ids.map((id: mongoose.Types.ObjectId) => id.toString());

    expect(idStrings).toContain(child._id.toString());
    expect(idStrings).toContain(grandChild._id.toString());
    expect(idStrings).not.toContain(root._id.toString());
    expect(idStrings.length).toBe(2);
  });

  it("throws error when node does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    await expect(getNodeAndDescendantIds(fakeId)).rejects.toThrow("Node not found");
  });
});
