const UserModel=require('../models/Customer')

exports.homepage = async (req, res) => {
    // Remove
    // const messages = await req.consumeFlash('info');
    // Use this instead
    const messages = await req.flash("info");
  
    const locals = {
      title: "NodeJs",
      description: "Free NodeJs User Management System",
    };
  
    let perPage = 12;
    let page = req.query.page || 1;
  
    try {
      const customers = await UserModel.aggregate([{ $sort: { createdAt: -1 } }])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
      // Count is deprecated. Use countDocuments({}) or estimatedDocumentCount()
      // const count = await Customer.count();
      const count = await UserModel.countDocuments({});
  
      res.render("index", {
        locals,
        customers,
        current: page,
        pages: Math.ceil(count / perPage),
        messages,
      });
    } catch (error) {
      console.log(error);
    }
  };



exports.addUser=async(req,res)=>{
    const locals={
        title:'Add Customers',
        description:'NodeJS CRUD'
    }
    
    res.render('customer/add.ejs',{locals})
}

exports.addUserToDB=async(req,res)=>{
    
    const user=new UserModel({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        tel:req.body.tel,
        email:req.body.email,
        details:req.body.details
    })
    
    try
    {
        //to create the customer 
        //method 1 //  
        //await user.save()
        //method 2//  
        await UserModel.create(user)

        //setup the flash
        await req.flash('info','New Customer Added')
        res.redirect("/");
    }
    catch(e){
        console.log(e)
    }
}

exports.viewCustomer=async(req,res)=>{

    const locals={
        title:'View Customers',
        description:'NodeJS CRUD'
    }
    
    try {
        const user =await UserModel.findOne({_id:req.params.id})
        res.render('customer/view',{
            locals,
            user
        })
    } catch (error) {
        console.log(user)
    }
}

exports.edit=async(req,res)=>{
    const customer =await UserModel.findOne({_id:req.params.id})
    res.render("customer/edit",{customer})
}

exports.editPost = async (req, res) => {
    try {
      await UserModel.findByIdAndUpdate(req.params.id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        tel: req.body.tel,
        email: req.body.email,
        details: req.body.details,
        updatedAt: Date.now(),
      });
     
      await res.redirect(`/edit/${req.params.id}`);

  
      console.log("redirected");
    } catch (error) {
      console.log(error);
    }
  };
  
exports.deleteUser=async(req,res)=>{
  try{
    const id=req.params.id
    await UserModel.findByIdAndDelete(id)
    await req.flash('info','Customer Deleted')
    res.redirect('/')
  }
  catch(error)
  {
    console.log(error)
  }
}

exports.searchUser=async(req,res)=>{
  let searchTerm=req.body.searchTerm;
  const serchNoSpecialChar=searchTerm.replace(/[^a-zA-Z0-9]/g,"");//regex banaya 
  try {
    const customers=await UserModel.find({
      $or:[
        {firstName:{$regex:new RegExp(serchNoSpecialChar,"i")}},
        {lastName:{$regex:new RegExp(serchNoSpecialChar,"i")}},
      ]
    })
    res.render("search",{customers});
  } catch (error) {
    console.log(error)
  }
}