import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  quote: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/50", // Default profile image
  },
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;
