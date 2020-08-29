const likeRouter = require('express').Router();
const firebase = require('firebase');

const db = require('../../auth/app');
const middleware = require('../../auth/authorization');

likeRouter.put('/', middleware.checkPost, middleware.checkToken, middleware.authorizeToken, async (req, res) => {
    try {
        const docRef = await db.collection('feeds').doc(req.body.postId);
        const resData = await docRef.get();
        if (!resData.exists) {
            return res.status(204).send('No data found');
        }

        let likeData = resData.data().likes;
        const userRef = await db.collection('users').doc(req.uid);

        if (likeData.includes(req.uid)) {
            await docRef.update({
                likes: firebase.firestore.FieldValue.arrayRemove(req.uid)
            });
            await userRef.update({
                likedPosts: firebase.firestore.FieldValue.arrayRemove(req.body.postId)
            });
            return res.status(200).send('Disliked The Post');
        }
        await docRef.update({
            likes: firebase.firestore.FieldValue.arrayUnion(req.uid)
        });
        await userRef.update({
            likedPosts: firebase.firestore.FieldValue.arrayUnion(req.body.postId)
        });
        return res.status(200).send('Liked The Post');
    } catch (err) {
        return res.send(err.toString());
    }
});

module.exports = likeRouter;