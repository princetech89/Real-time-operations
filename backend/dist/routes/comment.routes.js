"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_1 = require("../controllers/comment.controller");
const router = (0, express_1.Router)();
router.post('/', comment_controller_1.addComment);
router.get('/:id', comment_controller_1.getCommentsByIncident);
exports.default = router;
