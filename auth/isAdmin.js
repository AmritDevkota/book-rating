module.exports = (req, res, next) => {
    if(req.session.user) {
        req.user = req.session.user;
        // console.log(req.user);
        if(req.user.isAdmin) {
            next()
        } else {
            res.send('You are not authorized!')
        }
    } else {
        return res.redirect('/login');
    }
}