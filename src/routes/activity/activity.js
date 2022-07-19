const controller = require("../../controllers/activity");
const express = require("express");
const router = express.Router();

/*
 * Activites routes
 */

/*
 * Get all items route
 */
router.get("/all", controller.getAllItems);


/*
 * Get appointment by user-id route
 */
router.get("/user/:userId", controller.getByUser);



/*
 * Get appointment by id route
 */
router.get("/:id", controller.getById);

/*
 * Create new item route
 */
// trimRequest.all
router.post("/", controller.createItem);

/*
 * Update item route
 */
router.patch("/:id", controller.updateItem);

/*
 * Delete item route
 */
router.delete("/:id", controller.deleteItem);

module.exports = router;
