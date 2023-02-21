const professionalsRouter = require("express").Router();
const {
  addNewProfessional,
  getProfessional,
} = require("../controllers/app-controller");

professionalsRouter.route("/").post(addNewProfessional);
professionalsRouter.route("/:registration").get(getProfessional);

module.exports = professionalsRouter;
