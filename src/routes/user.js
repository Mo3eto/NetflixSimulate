const express = require('express')
const router = new express.Router()
const bcrypt = require('bcrypt')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/userAuth')
const mailservice = require('../email-services/email')
//Upload Profile-Picture
const upload = multer({
    limits: {
        fileSize:1000000
    },
    fileFilter(req, file, cb) { 
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) return cb(new Error('Please Upload a Image'))
        cb(undefined, true)
    }
})
//Sign Up 
router.post('/users/signup', upload.single('avatar'), async (req, res) => {
    const Buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,  
        password: await bcrypt.hash(req.body.password, 8),
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth,
        avatar: Buffer
    })
    try {
        await user.save() 
        const token = await user.generateToken()  
         mailservice.confirmationMail(user, token)  
        res.status(201).send({user, token})
    }
    catch(e) { 
        res.status(400).send(e)
    }
}) 

//Confirmation
router.get('/confirmation/:token', async (req, res) => {
    try {
        const user = await User.findOne({token:req.token})
        if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
        user.isVerified = true;
         await user.save()
         res.status(200).send("The account has been verified. Please log in.");
    }
    catch(e) {
        res.status(400).send(e)
    }
})

//Log IN
router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if (!user.isVerified) {
           return res.send('Check your inbox for confirmation mail')
        } 
        const token = await user.generateToken()     
        res.status(200).send({user, token})
    }
    catch(e) {
        res.status(400).send(e)
    }
})

//Forget Password
router.post('/users/forgot-password', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if(!user)
        {
            return res.status(400).send('No User With This E-Mail')
        }
        await mailservice.recoveryMail(user)
        res.status(200).send()

    }
    catch(e) {
        res.status(400).send(e)
    }
    
})

//Reset Password
router.post('/password-recovery/:token', async (req, res) => {
    try {
        const user = await User.findOne({token: req.token})
        user.password = await bcrypt.hash(req.body.password, 8 )
        await user.save()
        res.status(200).send('Password Updated')
    }
    catch(e) {
        res.status(400).send(e)
    }
})

//MY Profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

//Log Out
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter( (token) => {
            return token.token !== req.token
        } )
        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(400).send()
    }
})

//Log Out All
router.post('/users/logoutall', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send(e)
    }
})

//Update Profile
router.patch('/users/me', auth, async (req, res) => {
    const updates =  Object.keys(req.body)
    const allowedUpdates = ['firstName', 'lastName', 'email', 'password']
    const valid = updates.every( (update) => allowedUpdates.includes(update) )
    if(!valid)
    {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
 
    try {
        if(req.body.password){
           req.body.password = await bcrypt.hash(req.body.password, 8)
        }
        updates.forEach( (update) => req.user[update] = req.body[update] )
        await req.user.save()
        res.send(req.user)   
    }
    catch (e) {
        res.status(400).send(e)
    }

})

//Delete Profile
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    }
    catch (e) {
        res.status(500).send()
    }
})

//Delete Profile-Picture
router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send(req.user)
    }
    catch (e) {
        res.status(500).send()
    }
  
})


module.exports = router