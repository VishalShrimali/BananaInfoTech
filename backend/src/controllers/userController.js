import  User  from "../models/user.models.js";
import { Course } from "../models/course.models.js";

const userProfile = async (req, res) => {
    try{
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(401).json({ message: "No token provided" });
            try {
              const decoded = jwt.verify(token, process.env.JWT_SECRET);
              const user = { id: decoded.userId, email: decoded.email, role: decoded.role }; // Fetch from DB if needed
              res.status(200).json({ user });
            } catch (error) {
              res.status(401).json({ message: "Invalid token" });
            }
          
        //  const  _id  = req.params.id;
        //   // Find user in a single query
        // const user = await User.findById(_id);

        // if (!user) {
        //     return res.status(401).json({ message: "User does not exist." });
        // }

        //  res.status(201).json({
        //     message: "User Details",
        //     name: user.name,
        //     email: user.email
        //  })

    }
    catch(error){
            console.log("Error: ",error);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
};
const loginUser = async (req, res) => {
    try {
        console.log('Login request body:', req.body); // Debug log

        const { email, password } = req.body;

        if (!email || !password) {
            console.log('Missing credentials:', { email: !!email, password: !!password }); // Debug log
            return res.status(401).json({ message: "Email and Password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email); // Debug log
            return res.status(401).json({ message: "User not found." });
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            console.log('Invalid password for user:', email); // Debug log
            return res.status(401).json({ message: "Invalid password." });
        }

        const token = user.generateAuthToken();
        console.log('Generated token:', token); // Debug log

        return res.status(200).json({
            message: "Login successful.",
            token: token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error("Login error:", error); // Enhanced error logging
        return res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

const listCourses = async (_, res) => {
    try{
        const courses = await Course.find();
        res.status(200).json(courses);
    }
    catch(error){
        console.log("Error is : ",error);
        res.status(500).json({
            message: "Server Error."
        })
    }
}
const signUpUser = async (req, res) => {
    try{
        const { email, name, password } = req.body;

        console.log(email, name, password);

        if(!email || !password || !name) {
            return res.status(400).json({ message: "All fields are mandatory." });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ message: "User already exists." });
        };

        const user = await User.create({ email, name, password });
        res.status(201).json(
            {
                message: "User created successfully.",
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                }
            }
        );
        
    }
    catch(error){
        console.log("Error: ",error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });

        
    }
};
const updateUser = async (req, res) => {
    try{
        const { email, name, password } = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ message: "User already exists." });
        };

        if(!email || !password || !name) {
            return res.status(400).json({ message: "All fields are mandatory." });
        }
        const userNew = await User.findOneAndUpdate({ email, name, password });
        res.status(201).json(
            {
                message: "User Updated successfully.",
                name: userNew.name
            }
        );
        
    }
    catch(error){
        console.log("Error: ",error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });

        
    }
}
const removeUser = async (req, res) => {
    try{
        const  {id} = req.params;

        const userNew = await User.findOneAndDelete(id);
        res.status(201).json(
            {
                message: "User deleted successfully."
            }
        );
        
    }
    catch(error){
        console.log("Error: ",error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });

        
    }
}



// Endpoint to check payment status
const PaymentConfirmation = async (req, res) => {
    const { transactionId } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
  
    try {
      // Verify token (e.g., using JWT)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Simulate payment verification (replace with actual UPI transaction check)
      // For testing, assume the payment is completed after 10 seconds
      const transaction = transactions[transactionId];
      if (transaction) {
        const timeElapsed = (Date.now() - transaction.createdAt) / 1000; // Time in seconds
        if (timeElapsed > 10) {
          // Simulate successful payment after 10 seconds
          res.status(200).json({ status: "completed" });
        } else {
          res.status(200).json({ status: "pending" });
        }
      } else {
        // Simulate creating a new transaction entry
        transactions[transactionId] = { createdAt: Date.now() };
        res.status(200).json({ status: "pending" });
      }
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };

const contactUs =  async (req, res) => {
    try {
      const { name, email, message } = req.body;
  
      if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required." });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found. Please register first." });
      }
  
      user.messages.push({ name, email, message });
      await user.save();
  
      res.status(201).json({ message: "Your message has been sent successfully." });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  };

  

export {
    userProfile,
    loginUser,
    signUpUser,
    updateUser,
    removeUser,
    listCourses,
    contactUs,
    PaymentConfirmation
   
}