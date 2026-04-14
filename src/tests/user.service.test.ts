import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Node from "../models/Node";
import User from "../models/User";
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getEmployeesForNode,
  getEmployeesForNodeAndDescendants,
  getManagersForNode,
  getManagersForNodeAndDescendants,
} from "../services/user.service";

let mongoServer: MongoMemoryServer;
let rootNode: any;
let childNode: any;
let grandChildNode: any;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Node.deleteMany({});
  await User.deleteMany({});

  rootNode = await Node.create({ name: "Srbija", parent: null });
  childNode = await Node.create({ name: "Vojvodina", parent: rootNode._id });
  grandChildNode = await Node.create({ name: "Novi Sad", parent: childNode._id });
});

describe("User Service — createUser", () => {
  it("creates new user successfully", async () => {
    const user = await createUser({
      username: "new_user",
      password: "test0707",
      role: "EMPLOYEE",
      nodeId: rootNode._id.toString(),
    });

    expect(user.username).toBe("new_user");
    expect(user.role).toBe("EMPLOYEE");
    const userFromDb = await User.findOne({ username: "new_user" }).select("+password");
    expect(userFromDb?.password).toBeDefined();
    expect(userFromDb?.password).not.toBe("test0707");
  });

  it("throws error when username already exists", async () => {
    await createUser({
      username: "double_user",
      password: "test0707",
      role: "EMPLOYEE",
      nodeId: rootNode._id.toString(),
    });

    await expect(
      createUser({
        username: "double_user",
        password: "test0707",
        role: "EMPLOYEE",
        nodeId: rootNode._id.toString(),
      })
    ).rejects.toThrow("Username already exists");
  });
});

describe("User Service — getUserById", () => {
  it("returns user by ID", async () => {
    const created = await createUser({
      username: "test_user",
      password: "test0707",
      role: "EMPLOYEE",
      nodeId: rootNode._id.toString(),
    });

    const found = await getUserById(created._id.toString());
    expect(found).not.toBeNull();
    expect(found?.username).toBe("test_user");
  });

  it("returns null when user does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const found = await getUserById(fakeId);
    expect(found).toBeNull();
  });
});

describe("User Service — updateUser", () => {
  it("updates user successfully", async () => {
    const created = await createUser({
      username: "user_for_update",
      password: "test0707",
      role: "EMPLOYEE",
      nodeId: rootNode._id.toString(),
    });

    const updated = await updateUser(created._id.toString(), {
      username: "changed_user",
    });

    expect(updated?.username).toBe("changed_user");
  });

  it("throws error when user does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    await expect(updateUser(fakeId, { username: "new" })).rejects.toThrow(
      "User not found"
    );
  });
});

describe("User Service — deleteUser", () => {
  it("deletes user successfully", async () => {
    const created = await createUser({
      username: "user_for_deletition",
      password: "test0707",
      role: "EMPLOYEE",
      nodeId: rootNode._id.toString(),
    });

    await deleteUser(created._id.toString());
    const found = await getUserById(created._id.toString());
    expect(found).toBeNull();
  });

  it("throws error when user does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    await expect(deleteUser(fakeId)).rejects.toThrow("User not found");
  });
});


describe("User Service — getEmployeesForNode", () => {
  it("returns onlu employees on current node", async () => {
    await User.create({
      username: "emp_root",
      password: "dummy",
      role: "EMPLOYEE",
      nodeId: rootNode._id,
    });
    await User.create({
      username: "mgr_root",
      password: "dummy",
      role: "MANAGER",
      nodeId: rootNode._id,
    });

    const employees = await getEmployeesForNode(rootNode._id.toString());
    expect(employees.length).toBe(1);
    expect(employees[0].username).toBe("emp_root");
  });

  it("returns empty array if there are not employees on the node", async () => {
    const employees = await getEmployeesForNode(rootNode._id.toString());
    expect(employees).toEqual([]);
  });
});

describe("User Service — getEmployeesForNodeAndDescendants", () => {
  it("returns employees from node and all descendants", async () => {
    await User.create({
      username: "emp_root",
      password: "dummy",
      role: "EMPLOYEE",
      nodeId: rootNode._id,
    });
    await User.create({
      username: "emp_child",
      password: "dummy",
      role: "EMPLOYEE",
      nodeId: childNode._id,
    });
    await User.create({
      username: "mgr_grandchild",
      password: "dummy",
      role: "MANAGER",
      nodeId: grandChildNode._id,
    });

    const employees = await getEmployeesForNodeAndDescendants(
      rootNode._id.toString()
    );
    const usernames = employees.map((u) => u.username);

    expect(usernames).toContain("emp_root");
    expect(usernames).toContain("emp_child");
    expect(usernames).not.toContain("mgr_grandchild");
    expect(employees.length).toBe(2);
  });
});

describe("User Service — getManagersForNode", () => {
  it("returns only managers on current node", async () => {
    await User.create({
      username: "mgr_grandchild",
      password: "dummy",
      role: "MANAGER",
      nodeId: grandChildNode._id,
    });

    const managers = await getManagersForNode(grandChildNode._id.toString());
    expect(managers.length).toBe(1);
    expect(managers[0].username).toBe("mgr_grandchild");
  });

  it("returns empty array if there are not managers on current node", async () => {
    const managers = await getManagersForNode(rootNode._id.toString());
    expect(managers.length).toBe(0);
  });
});

describe("User Service — getManagersForNodeAndDescendants", () => {
  it("reeturns managers from node and all descendants", async () => {
    await User.create({
      username: "mgr_grandchild",
      password: "dummy",
      role: "MANAGER",
      nodeId: grandChildNode._id,
    });
    await User.create({
      username: "emp_root",
      password: "dummy",
      role: "EMPLOYEE",
      nodeId: rootNode._id,
    });

    const managers = await getManagersForNodeAndDescendants(
      rootNode._id.toString()
    );
    const usernames = managers.map((u) => u.username);

    expect(usernames).toContain("mgr_grandchild");
    expect(usernames).not.toContain("emp_root");
    expect(managers.length).toBe(1);
  });
});