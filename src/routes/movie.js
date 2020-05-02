const express = require('express')
const router = new express.Router()
const Movie = require('../models/movie')

router.post('/movie', async (req, res) => {
    console.log('enter')
    const movie = await new Movie(req.body)
    console.log('new movie')
    try{
        console.log('before save')
        await movie.save()
        console.log('after save')
        res.status(201).send(movie)
    }
    catch(e){
        res.status(400).send(e)
    }
    
})


module.exports = router