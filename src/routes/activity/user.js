const controller = require("../../controllers/user");
const validate = require("../../controllers/user.validate");
const express = require("express");
const router = express.Router();
const trimRequest = require("trim-request");

/*
 * Activites routes
 */

/*
 * Get all items route
 */
router.get("/all", controller.getAllItems);

/*
 * Create new item route
 */
router.post("/", trimRequest.all, controller.createItem);

/*
 * Update item route
 */
router.patch("/:id", trimRequest.all, controller.updateItem);

/*
 * Delete item route
 */
router.delete("/:id", trimRequest.all, controller.deleteItem);

module.exports = router;
