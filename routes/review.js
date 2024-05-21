const express = require('express');
const Review = require('../models/Review');
const { authenticateJWT } = require('../middleware/authenticateJWT');

const router = express.Router();

router.use(authenticateJWT);

router.get('/:vehicle_id/reviews', async (req, res) => {
    try {
        const reviews = await Review.find({ vehicle_id: req.params.vehicle_id }).populate('user_id', 'name');
        res.status(200).send(reviews);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/:vehicle_id/reviews', async (req, res) => {
    try {
        const review = new Review({ ...req.body, vehicle_id: req.params.vehicle_id, user_id: req.user.id });
        await review.save();
        res.status(201).send(review);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.put('/reviews/:review_id', async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.review_id, req.body, { new: true }).populate('user_id', 'name');
        if (review) {
            res.status(200).send(review);
        } else {
            res.status(404).send({ error: 'Review not found' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.delete('/reviews/:review_id', async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.review_id);
        if (review) {
            res.status(200).send({ message: 'Review deleted successfully' });
        } else {
            res.status(404).send({ error: 'Review not found' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
