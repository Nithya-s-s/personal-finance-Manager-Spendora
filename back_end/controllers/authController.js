const User=require('../models/user')
const jwt=require("jsonwebtoken");
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'1h'});
};

exports.registerUser=async(req,res)=>{
    const{fullName,email,password}=req.body;
    // Get file name if avatar uploaded
    let profileImageUrl = req.body.profileImageUrl || null;
    if (req.file) {
      profileImageUrl = req.file.filename;
    }
    if(!fullName||!email||!password){
        return res.status(400).json({message:"All fields are required"});
    }
    try{
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"email already in use"});
        }
        const user=await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });
        // Only send safe user info
        res.status(201).json({
            id:user._id,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profileImageUrl: user.profileImageUrl
            },
            token:generateToken(user.id),
        });
    }catch(err){
         res
        .status(500)
        .json({message:"Error registering user",error:err.message});
    }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Only send safe user info
    res.status(200).json({
      id: user._id,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageUrl: user.profileImageUrl
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in user", error: err.message });
  }
};

// Get User Info
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
};
