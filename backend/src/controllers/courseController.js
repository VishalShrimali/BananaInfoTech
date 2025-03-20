import { Course } from "../models/course.models.js";

const addCourse =  async (req, res) => {
    try{
        let { title,  description, price, lessons, studentsEnrolled } = req.body;
        const newcourse = await Course.create({title,  description, price, lessons, studentsEnrolled});
        const token = newcourse.generateAuthToken();
        return res.status(201).json({
            message: "Course added succesfully",
            token
            
        })
    }
    catch(error){
        console.log("Error is : ",error);
        res.status(500).json({
            message: "Server Error."
        })
        
    }
};
const viewCourse = async (req, res) => {
    try{
         const _id  = req.params.id;
                  // Find user in a single query
                const course = await Course.findById(_id);
        
                if (!course) {
                    return res.status(401).json({ message: "Course does not exist." });
                }
        
                 res.status(201).json({
                    message: "Course Details",
                    title: course.title,
                    description: course.description
                 })
    }
    catch(error){
        console.log("Error is : ",error);
        res.status(500).json({
            message: "Server Error."
        })
        
    }
};
const updateCourse = async (req, res) => {
    try{
          const { title, description, price } = req.body;
  
          const existingCourse = await Course.findOne({title});
          if(existingCourse){
              return res.status(400).json({ message: "Course already exists." });
          };
  
          if(!title || !description || !price) {
              return res.status(400).json({ message: "All fields are mandatory." });
          }
          const newcourse = await Course.findOneAndUpdate({ title, description, price  });
          res.status(201).json(
              {
                  message: "Course Updated successfully.",
                  name: newcourse.name
              }
          );
          
      }
      catch(error){
          console.log("Error: ",error);
          res.status(500).json({ message: "Internal Server Error", error: error.message });
  
          
      }
          
      
  };
const deleteCourse = async (req, res) => {
    try{
          const _id = req.params.id
          const course = await Course.findByIdAndDelete(_id);
        
                if (!course) {
                    return res.status(401).json({ message: "Course does not exist." });
                }
        
                 res.status(201).json({
                    message: "Course Deleted successfully.",

                 })
          
      }
      catch(error){
          console.log("Error: ",error);
          res.status(500).json({ message: "Internal Server Error", error: error.message });
  
          
      }
          
      
} ;

export {
    addCourse,
    viewCourse,
    updateCourse,
    deleteCourse,
   
}
