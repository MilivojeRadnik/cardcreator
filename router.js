const express = require('express');
const router = express.Router();

const controller = require('./controller');
const auth = require('./auth');

router.get('/login', controller.loginGet);
router.get('/token', controller.login);
router.get('/logout', controller.logout);
router.get('/', auth.authenticateToken, controller.formGet);
router.post('/', auth.authenticateToken, controller.formPost);
router.get('/list', auth.authenticateToken, controller.listGet);
router.get('/list-select', auth.authenticateToken, controller.listSelectGet);
router.get('/delete', auth.authenticateToken, controller.deleteCard);
router.post('/card', auth.authenticateToken, controller.cardUpdate);
router.get('/card', auth.authenticateToken, controller.cardDetailsGet);
router.get(
  '/list-panel',
  auth.authenticateToken,
  controller.ifCreator,
  controller.listPanelGet
);
router.get('/edit', auth.authenticateToken, controller.cardPanelGet);
router.post('/edit', auth.authenticateToken, controller.cardPanelPost);
router.get('/list-done', auth.authenticateToken, controller.doneGet);
router.get('/viewcard', auth.authenticateToken, controller.viewCardGet);
router.get('/discussions', auth.authenticateToken, controller.discussionsGet);
router.get(
  '/create-discussion',
  auth.authenticateToken,
  controller.discusionCreateGet
);
router.post(
  '/create-discussion',
  auth.authenticateToken,
  controller.discusionCreatePost
);
router.get('/discussion', auth.authenticateToken, controller.discussionGet);
router.post(
  '/discussion',
  auth.authenticateToken,
  controller.discussionComment
);
router.get('/updatelog', controller.updateLogGet);

module.exports = router;
