import bcrypt from "bcrypt"
import Node from "../models/Node"
import User from "../models/User"

const createNode = async (name: string, parent?: any) => {
    return await Node.create({
        name,
        parent: parent?._id || null,
    });
};

const seedData = async (): Promise<void> => {
    try {
        const srbija = await createNode("Srbija");

        const vojvodina = await createNode("Vojvodina", srbija);
        const gradBeograd = await createNode("Grad Beograd", srbija);

        const severnobackiOkrug = await createNode("Severnobacki okrug", vojvodina);
        const juznobackiOkrug = await createNode("Juznobacki okrug", vojvodina);

        const subotica = await createNode("Subotica", severnobackiOkrug);
        const radnja1 = await createNode("Radnja1", subotica);

        const noviSad = await createNode("Novi Sad", juznobackiOkrug);
        const detelinara = await createNode("Detelinara", noviSad);
        const radnja2 = await createNode("Radnja 2", detelinara);
        const radnja3 = await createNode("Radnja 3", detelinara);

        const liman = await createNode("Liman", noviSad);
        const radnja4 = await createNode("Radnja 4", liman);
        const radnja5 = await createNode("Radnja 5", liman);

        const noviBeograd = await createNode("Novi Beograd", gradBeograd);
        const bezanija = await createNode("Bezanija", noviBeograd);
        const radnja6 = await createNode("Radnja 6", bezanija);

        const vracar = await createNode("Vracar", gradBeograd);
        const neimar = await createNode("Neimar", vracar);
        const radnja7 = await createNode("Radnja 7", neimar);

        const crveniKrst = await createNode("Crveni krst", vracar);
        const radnja8 = await createNode("Radnja 8", crveniKrst);
        const radnja9 = await createNode("Radnja 9", crveniKrst);

        console.log("Nodes seeded successfully!");

        const hashedPassword = await bcrypt.hash("test0707test",10);

        await User.create({
            username: "admin_srbija",
            password: hashedPassword,
            role: "MANAGER",
            nodeId: srbija._id
        });

        await User.create({
            username: "manager_vojvodina",
            password: hashedPassword,
            role: "MANAGER",
            nodeId: vojvodina._id
        });

        await User.create({
            username: "manager_beograd",
            password: hashedPassword,
            role: "MANAGER",
            nodeId: gradBeograd._id
        });

        await User.create({
            username: "manager_novisad",
            password: hashedPassword,
            role: "MANAGER",
            nodeId: noviSad._id
        });

        await User.create({
            username: "manager_liman",
            password: hashedPassword,
            role: "MANAGER",
            nodeId: liman._id
        });

        await User.create({
            username: "manager_noviBeograd",
            password: hashedPassword,
            role: "MANAGER",
            nodeId: noviBeograd._id
        });


        await User.create({
            username: "manager_vracar",
            password: hashedPassword,
            role: "MANAGER",
            nodeId: vracar._id
        });

        await User.create({
            username: "manager_radnja8",
            password: hashedPassword,
            role: "MANAGER",
            nodeId: radnja8._id
        });

        await User.create({
            username: "employee_subotica",
            password: hashedPassword,
            role: "EMPLOYEE",
            nodeId: subotica._id
        });

        await User.create({
            username: "employee_bezanija1",
            password: hashedPassword,
            role: "EMPLOYEE",
            nodeId: bezanija._id
        });

        await User.create({
            username: "employee_bezanija2",
            password: hashedPassword,
            role: "EMPLOYEE",
            nodeId: bezanija._id
        });

        await User.create({
            username: "employee_bezanija3",
            password: hashedPassword,
            role: "EMPLOYEE",
            nodeId: bezanija._id
        });

        await User.create({
            username: "employee_neimar",
            password: hashedPassword,
            role: "EMPLOYEE",
            nodeId: neimar._id
        });

        await User.create({
            username: "employee_radnja2",
            password: hashedPassword,
            role: "EMPLOYEE",
            nodeId: radnja2._id
        });

        await User.create({
            username: "employee_detelinara",
            password: hashedPassword,
            role: "EMPLOYEE",
            nodeId: detelinara._id
        });

        await User.create({
            username: "employee_radnja4",
            password: hashedPassword,
            role: "EMPLOYEE",
            nodeId: radnja4._id
        });

        await User.create({
            username: "employee_radnja5",
            password: hashedPassword,
            role: "EMPLOYEE",
            nodeId: radnja5._id
        });

        await User.create({
            username: "employee_radnja8",
            password: hashedPassword,
            role: "EMPLOYEE",
            nodeId: radnja8._id
        });

        await User.create({
            username: "employee_radnja9",
            password: hashedPassword,
            role: "EMPLOYEE",
            nodeId: radnja9._id
        });

        await User.create({
            username: "employee_crveniKrst",
            password: hashedPassword,
            role: "EMPLOYEE",
            nodeId: crveniKrst._id
        });

        await User.create({
            username: "employee_gradBeograd",
            password: hashedPassword,
            role: "EMPLOYEE",
            nodeId: gradBeograd._id
        });

        console.log("Users seeded successfully");
        console.log("Database seeded sucessfully");

    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

export default seedData;