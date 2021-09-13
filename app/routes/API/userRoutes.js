const express = require('express');
const uuid = require('uuid');
const multer = require('multer');
const path = require('path');
const userRouter = express.Router();
const userController = require('../../controllers/userController');
const authorizationMiddleware = require('../../middleware/authorizationMiddleware');

const storage = multer.diskStorage({
    destination: function(req, file, next){
        next(null, 'assets/profile_pict');
    },
    filename: function(req, file, next){
        next(null, uuid.v4() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, next)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        next(null, true);
    }else{
        next(new Error('Please only upload jpeg, jpg, and png'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

userRouter.get('/search/:key', userController.findUser);
userRouter.get("/:id", userController.getUserDetail);
userRouter.post("/register", userController.register);
userRouter.patch('/:id', authorizationMiddleware.checkLogin, upload.single('profile_pict'), userController.editUser);
userRouter.get("/verify", userController.verification);
userRouter.post("/login", userController.login);
userRouter.post("/logout", userController.logout);

module.exports = userRouter;