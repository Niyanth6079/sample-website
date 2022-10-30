const express = require('express')
const router = express.Router()
const CatchAsync = require('../utils/CatchAsync')
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})


// router.get('/', (req, res) => {
//     res.render('home')
// })

router.get('/', CatchAsync(campgrounds.index))

router.post('/', isLoggedIn, upload.array('image'), validateCampground,  CatchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn,campgrounds.renderNewForm)

router.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(campgrounds.renderEditForm))

router.get('/:id', CatchAsync(campgrounds.showCampground))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'),validateCampground, CatchAsync(campgrounds.updateCampground))

router.delete('/:id', isLoggedIn, isAuthor, CatchAsync(campgrounds.deleteCampgound))

module.exports = router