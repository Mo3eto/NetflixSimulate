const express = require('express')
const router = new express.Router()
const tvShow = require('../models/tvShow')

router.post('/tvshow', async (req, res) => {
    console.log('enter')
    const tvshow = await new tvShow(req.body)
    console.log('new movie')
    try{
        console.log('before save')
        await tvshow.save()
        console.log('after save')
        res.status(201).send(tvshow)
    }
    catch(e){
        res.status(400).send(e)
    }
    
})


module.exports = router