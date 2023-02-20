const professionalsRouter = require("express").Router();
const { addNewProfessional } = require("../controllers/app-controller");

professionalsRouter.route("/").post(addNewProfessional);

module.exports = professionalsRouter;
