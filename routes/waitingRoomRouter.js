const {
  getWaitingRoomUsers,
  addWaitingRoomUser,
  removeUserFromWR,
} = require("../controllers/app-controller");

const waitingRoomRouter = require("express").Router();

waitingRoomRouter.route("/").get(getWaitingRoomUsers).post(addWaitingRoomUser);
waitingRoomRouter.route("/:username").delete(removeUserFromWR);
module.exports = waitingRoomRouter;
