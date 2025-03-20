import Testimonial from "../models/testimonials.models.js";


// Get all testimonials
 const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Create a new testimonial
 const createTestimonial = async (req, res) => {
  const { name, role, quote, image } = req.body;

  try {
    const newTestimonial = new Testimonial({ name, role, quote, image });
    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(500).json({ message: "Failed to add testimonial: " + error.message });
  }
};

// Delete a testimonial
 const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    await testimonial.deleteOne();
    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting testimonial: " + error.message });
  }
};

export { getTestimonials, createTestimonial, deleteTestimonial };