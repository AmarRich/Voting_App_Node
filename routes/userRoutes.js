const express = require('express')
const router = express.Router()
const User = require('./../models/user')
const {jwtAuthMiddleware,generateToken} = require('./../jwt')


router.get('/profile' , jwtAuthMiddleware, async(req,res) => {
  try{
    const userData = req.user
    console.log("User data :", userData);
    const userId = userData.id
    const user =await User.findById(userId)
    res.status(200).json({user})

  }catch (err){
    console.log(err);
    res.status(500).json({error:'Internal server error'})
  }
})

// router.get('/:workType',async(req,res) => {
//     try {
//       const workType=req.params.workType
  
//       if(workType == 'chef' || workType == 'manager'  || workType == 'waiter' ){
//         const response = await Person.find({work:workType})
//         console.log('response fetched');
//         res.status(200).json(response)
//       }else{
//         res.status(404).json({error : "Invalid work type"})
//       }
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({error:'Internal server error'})
//     }
//   })


  


  // router.get('/', jwtAuthMiddleware,async function (req, res) {
  //   try {
  //     const data = await Person.find()
  //     console.log('data fetched');
  //     res.status(200).json(data)
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({error:'Internal server error'})
  //   } 
  //   })



    
router.post('/signup',async (req, res) =>{
    try {
     const data = req.body
     const newUser = new User(data)
     const response = await newUser.save()
     console.log('data saved')

      const payload = {
        id:response.id
      }

     const token = generateToken(payload)
     console.log(JSON.stringify(payload));
     console.log("Token is" , token);

     res.status(200).json({response : response, token : token })
    } catch (err) {
     console.log(err);
     res.status(500).json({error:'Internal server error'})
    }
   
   })

   router.post('/login',async(req,res) => {
    try{
      const {aadharCardNumber,password} = req.body
      const user = await User.findOne({aadharCardNumber : aadharCardNumber})

      if(!user) return res.status(401).json({error : 'Invalid username '})
      if(!(await user.comparePassword(password))) return res.status(401).json({error : 'Invalid password'})

        const payload = {
          id : user.id
         
        }

        const token =  generateToken(payload)
        res.json({token})

    }catch(err){
      console.log(err);
     res.status(500).json({error:'Internal server error'})
    }
   })

router.put('/profile/password', jwtAuthMiddleware,async (req,res) => {
    try {
        const userId = req.user.id
        const {currentPassword,newPassword} = req.body
        const user= await User.findById(userId)

        // if(!user) return res.status(401).json({error : 'Invalid username '})
        if(!(await user.comparePassword(currentPassword))) return res.status(401).json({error : 'Invalid password'})
    
        user.password=newPassword
        await user.save()


        // const updatedPersonData = req.body
        // const response = await Person.findByIdAndUpdate(personId,updatedPersonData,{
        //     new : true,
        //     runValidators : true
        // })

        // if(!response){
        //     return res.status(404).json({error:'Person not found'})
        // }

        console.log('Password updated')
        res.status(200).json({message: "Password updated"})
    } catch (err) {
        console.log(err);
        res.status(500).json({error:'Internal server error'})
    }
})

// router.delete('/:id',async (req,res) => {
//     try {
//         const personId = req.params.id
//         const updatedPersonData = req.body
//         const response = await Person.findByIdAndDelete(personId)

//         if(!response){
//             return res.status(404).json({error:'Person not found'})
//         }

//         console.log('data deleted')
//         res.status(200).json({message : 'Person deleted successfully'})
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({error:'Internal server error'})
//     }
// })

   
   module.exports = router