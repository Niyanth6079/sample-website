const User = require('../models/user')

module.exports.renderUserRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpCamp')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLoginPage =  (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = (req, res) => {
    const redirectUrl = res.locals.redirectUrl || '/campgrounds'
    req.flash('success', 'welcome back')
    res.redirect(redirectUrl)
}

module.exports.logoutUser  = (req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(err)
        }
        req.flash('success', 'goodbye')
        res.redirect('/campgrounds')
    });
}