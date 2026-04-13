import {Router} from "express"
import * as userController from "../controllers/user.controller"
import {
    authenticate,
    authorizeRoles,
    authorizeNodeAccess
} from "../middleware/auth.middleware"

const router = Router();

router.use(authenticate);

router.get("/nodes/employees",userController.getEmployeesForNode);

router.get("/nodes/employees/descendants",userController.getEmployeesForNodeAndDescendants);

router.get("/nodes/managers", authorizeRoles("MANAGER"),userController.getManagersForNode);

router.get("/nodes/managers/descendants", authorizeRoles("MANAGER"), userController.getManagersForNodeAndDescendants);

router.post("/", authorizeRoles("MANAGER"), authorizeNodeAccess, userController.createUser);

router.get("/:id", authorizeRoles("MANAGER"), authorizeNodeAccess, userController.getUserById);

router.put("/:id", authorizeRoles("MANAGER"), authorizeNodeAccess, userController.updateUser);

router.delete("/:id", authorizeRoles("MANAGER"), authorizeNodeAccess, userController.deleteUser);

export default router;


