const express = require('express');


/** 
 * @param {express.Request} req
 * @param {express.Response} res
 */
const isLoggedIn = function (req,res,next) {
    if (req.session.user) {
        return next();
    } else {
        return res.redirect('/account/login');
    }
}


module.exports = {isLoggedIn}