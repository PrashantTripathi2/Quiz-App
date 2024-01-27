const express = require('express');
const router = express.Router();

router.use('/*',(req,res,next)=>{
    if(req?.session?.user?.type == 'user'){
        next();
    }
    else{
        res.redirect('/');
    }
});

module.exports = router;