const router = require("express").Router();

const log = require("../controllers/log");

router.post("/", log.addLog);
router.get("/", log.getLogs);



module.exports = router;