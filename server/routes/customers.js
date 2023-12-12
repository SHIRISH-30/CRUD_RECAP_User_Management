const express=require('express');
const router=express.Router();
const customerController=require('../controller/customerController')


router.get('/',customerController.homepage);
router.get('/add',customerController.addUser)

router.post('/add',customerController.addUserToDB)
router.get('/view/:id',customerController.viewCustomer)
router.get('/edit/:id',customerController.edit);
router.put('/edit/:id',customerController.editPost);
router.delete('/edit/:id',customerController.deleteUser);
router.post("/search",customerController.searchUser)
module.exports=router

