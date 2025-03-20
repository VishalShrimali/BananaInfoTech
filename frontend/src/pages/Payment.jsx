import { Link } from "react-router-dom";

const PaymentPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Complete Your Payment</h1>
      <p className="text-lg text-gray-600 mb-4">Scan the QR code below to proceed with the payment.</p>

      {/* QR Code Image */}
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <img
          src="/images/payment-qr.png" // Replace with your QR Code image
          alt="QR Code"
          className="w-64 h-64 object-cover"
        />
      </div>

      {/* Back to Courses Button */}
      <Link
        to="/courses"
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
      >
        Back to Courses
      </Link>
    </div>
  );
};

export default PaymentPage;
