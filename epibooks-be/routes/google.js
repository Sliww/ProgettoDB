const express = require('express')
const google = express.Router()
const session = require('express-session')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const jwt = require('jsonwebtoken')
require('dotenv').config()

google.use(session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true
}))

google.use(passport.initialize())

google.use(passport.session())
   
passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    (accessToken, refreshToken, profile, done) => {
        console.log("DATI UTENTE", profile)
        return done(null, profile)
    })
)

google.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }), (req, res) => {
    const redirectUrl = `${process.env.FRONTEND_URL}/success?user=${encodeURIComponent(JSON.stringify(req.user))}`
    res.redirect(redirectUrl)
})

google.get(
    '/auth/google/callback', 
    passport.authenticate('google', {
        failureRedirect: `/`
    }),
    (req, res) => {
        const user = req.user
        const token = jwt.sign(user, process.env.JWT_SECRET)
        const redirectUrl = `${process.env.FRONTEND_URL}/success/${encodeURIComponent(token)}`
        res.redirect(redirectUrl)
    }
)

module.exports = google