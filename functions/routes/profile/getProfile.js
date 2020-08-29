const profileRouter = require('express').Router();
const firebase = require('firebase');
const db = require('../../auth/app');
const middleware = require('../../auth/authorization');

profileRouter.get('/',middleware.checkToken,middleware.authorizeToken, async ( req, res, next) =>{
    try {
        const docRef = await db.collection('users').doc(req.uid);
        const resData = await docRef.get();
        // if(!resData.exists){
        //    return res.status(204).send('No user found');
        // }
        // else {
        //     console.log('Document data:', doc.data());
        // }

        return res.status(200).send(resData.data());
        
    } catch (err) {
        return res.send(err);
    }

});

module.exports = profileRouter