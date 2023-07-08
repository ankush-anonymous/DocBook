const express = require('express')
const router = express.Router()

const {
    getAllSlots,getSlots,createSlots,updateSlots,deleteSlots
} = require('../controllers/Slots')

router.route('/').post(createSlots).get(getAllSlots)
router.route('/:id').get(getSlots).patch(updateSlots).delete(deleteSlots)

module.exports = router

