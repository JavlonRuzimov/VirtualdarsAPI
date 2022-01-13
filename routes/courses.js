const {Course, validate} = require('../models/course');
const {Category} = require('../models/category')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


router.get('/', async (req, res) => {
    const courses = await Course.find().sort('title');
    res.send(courses);
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if(error) {
        return  res.status(400).send(error.details[0].message)
    }

    const category = await Category.findById(req.body.categoryId);
    if(!category) {
        return res.status(400).send("Berilgan ID ga teng toifa topilmadi...")
    }
    
    let course = new Course({
        title: req.body.title,
        category: {
            _id: category._id,
            name: category.name
        },
        trainer: req.body.trainer,
        tags: req.body.tags,
        status: req.body.status,
        fee: req.body.fee
    });

    course = await course.save();

    res.status(201).send(course);  
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const category = await Category.findById(req.body.categoryId);
    if(!category) {
        return res.status(400).send("Berilgan ID ga teng toifa topilmadi...")
    }

    const course = await Course.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        category: {
            _id: category._id,
            name: category.name
        },
        trainer: req.body.trainer,
        tags: req.body.tags,
        status: req.body.status,
        fee: req.body.fee
    }, { new: true });

    if(!course) {
        return res.status(404).send('Berilgan ID ga teng bolgan kurs topilmadi.')
    };
    res.send(course)
});

router.delete('/:id', async (req, res) => { 
    const course = await Course.findByIdAndRemove(req.params.id);
    if(!course) {
        return res.status(404).send('Berilgan ID ga teng bolgan kurs topilmadi.')
    };
    res.send(course);
});

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);
    if(!course) {
        return res.status(404).send('Berilgan ID ga teng bolgan kurs topilmadi.')
    };
    res.send(course);
})


module.exports = router;