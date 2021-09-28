const sgMail = require('@sendgrid/mail')

// This is the "Task App" api key
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// This function returns a promise so we could use async await to wait on it if we want (we don't)
const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'brianplavery@gmail.com',
    subject: 'Welcome to Task Manager',
    text: `Welcome to the app ${name}! Let me know how you get along with the app.`
  })
}

// Email to send once someone cancels their account
const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'brianplavery@gmail.com',
    subject: "We're sorry to see you go. Thanks so much for being part of our journey",
    text: `Goodbye ${name}! We're sad that you decided to leave us, but we're also grateful you allowed us to play a role in your life. Is there anything we could have done differently?`
  })
}

// Set as an object to export multiple functions
module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
}
