const sgMail = require('@sendgrid/mail')
const jwt = require('jsonwebtoken')

sgMail.setApiKey(process.env.sendgridAPIKey);

const confirmationMail =  (user, token) => {
   // const token = await jwt.sign({_id: user._id}, this.process.env.JWT_SECRET) 
    const url = `http://localhost:3000/confirmation/${token}`
    const msg = {
        to: user.email,
        from: 'moatasemsalama954@outlook.com',
        subject: 'Confirmation Mail',
         text:`Welcome Here Mr. ${user.firstName} , Confirm Your Mail and Lets Go !` ,
         html: `Confirmation Email <a href = ${url}>${url}</a>`
    }    
      sgMail.send(msg)

}

const welcomeEmail = (user) => {
    
    const msg = {
        to: user.email,
        from: 'moatasemsalama954@outlook.com',
        subject: 'Welcome Email',
        text:`Welcome here Mr. ${user.firstName} ,How things going on !` 
    }
        sgMail.send(msg)
    }
module.exports = { 
    confirmationMail,
    welcomeEmail
} 