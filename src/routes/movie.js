const express = require('express')
const router = new express.Router()
const Movie = require('../models/movie')

router.post('/movie', async (req, res) => {
    req.body.title = req.body.title.toLowerCase().trim()
    const movie = await new Movie(req.body)
    try{
        await movie.save()
        res.status(201).send(movie)
    }
    catch(e){
        res.status(400).send(e)
    }
    
})

router.get('/movies/all', async (req, res) => {
    try{
        const movies = await Movie.find( {}, null, 
            {
             limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip)
        } )
        res.status(200).send(movies)    
    }
    catch (e){
        res.status(400).send(e)
    }
    
})
 
router.get('/movies/:title', async (req, res) => {
    
        try{
            const search = req.params.title.match(/extraction/)
            const movie =  await Movie.find ({title:search})
            res.send(movie)       
        }
        catch(e){
            res.status(400).send(e)  
        }
})
module.exports = router