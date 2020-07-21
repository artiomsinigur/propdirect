const multer = require('multer');

const checkRoles = (...roles) => (req, res, next) => {
    if (!req.user) {
        req.flash('errorMsg', "Accès refusé. Veuillez vous connecter.");
        return res.redirect('/login');
        // return res.status(401).send();
    }

    const hasRole = roles.find(role => req.user.role === role);
    if (!hasRole) {
        req.flash('errorMsg', "Accès refusé. Vous n'avez pas l'autorisation d'accéder à cette page.");
        return res.redirect('/');
        // return res.status(403).send();
    }

    return next();
}

const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('errorMsg', 'Accès refusé. Veullez vous connecter.');
    res.redirect('/login');
}

// Configuration
const upload = multer({
    // Limit size file to 1MB
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        // Allowed formats
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload files only with following extensions: JPG, JPEG or PNG'));
        }
        // Accept file
        cb(undefined, true);
    }
});

module.exports = { checkRoles, upload, auth };