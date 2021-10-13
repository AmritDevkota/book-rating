exports.get404 = (req, res, next) => {
    const user = req.user;
    res.status(404).render('404', {
        pageTitle: 'Page Not Found!',
        user: user
    });
}