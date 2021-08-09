const local = async (req, res, next) =>{
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.user = req.user;
    next();
}

module.exports = local;