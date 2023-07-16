const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middleware/auth');
const {User} = require('../models/user');
const {Treatmentrec} = require('../models/treatmentrec');

router.get('/',auth,async(req,res)=>{
    let user = await User.findById(req.user._id);

    if(user.role === 'Associate Dentist'){
    let revenues = await Treatmentrec
                        .find({handledby:req.user._id, paid:true})
                        .select('procedure date')
                        .populate('procedure', 'amount');
                       
    
    res.send(revenues);
    }
    else{
    let revenues = await Treatmentrec
        .find({dentist: req.user._id,paid:true})
        .select('procedure date')
        .populate('procedure','amount');
       
    res.send(revenues);
    }
});

module.exports = router;