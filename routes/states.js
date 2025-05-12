const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');


//info

router.get('/', statesController.getAllStates);
router.get('/:state/capital', statesController.getCapital);
router.get('/:state/nickname', statesController.getNickname);
router.get('/:state/population', statesController.getPopulation);
router.get('/:state', statesController.getState);


//facts


router.post('/:state/funfact', statesController.createFunFact);
router.patch('/:state/funfact', statesController.updateFunFact);
router.delete('/:state/funfact', statesController.deleteFunFact);


module.exports = router;

