const express = require('express')
const router = express.Router({mergeParams:true});

const CatchAsync = require('../utils/CatchAsync')
const {validateReview , isLoggedIn , isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')







router.post('/', isLoggedIn , validateReview ,CatchAsync(reviews.createReview))

router.delete('/:reviewid' ,isLoggedIn, isReviewAuthor ,CatchAsync(reviews.deleteReview))

module.exports = router;