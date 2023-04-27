const express = require("express");
const {
  createNewRole,
  createPermission,
  createNewRolePermission,
} = require("../controllers/roles");

const rolesRouter = express.Router();
rolesRouter.post("/", createNewRole);
rolesRouter.post("/permission", createPermission);
rolesRouter.post("/role_permission", createNewRolePermission);

module.exports = rolesRouter;
