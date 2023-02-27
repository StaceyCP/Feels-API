const professionalsRouter = require("express").Router();
const {
  addNewProfessional,
  getProfessional,
  updateProfessional,
} = require("../controllers/app-controller");

professionalsRouter.route("/").post(addNewProfessional);
professionalsRouter
  .route("/:registration")
  .get(getProfessional)
  .patch(updateProfessional);

module.exports = professionalsRouter;
