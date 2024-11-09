const express = require("express");
const router = express.Router();
const tryCatcher = require("../utils/tryCatcher");
const { passwordHashing, validateToken } = require("../middlewares/userAuth");

const { getJhandiMundaBets } = require("../controllers/jhandiMunda");

router.get(
  "/jhandiMunda",
  validateToken,
  tryCatcher(async (req, res) => {
    const gamebets = await getJhandiMundaBets(req.user);
    res.status(200).json(gamebets);
  })
);

module.exports = router;
