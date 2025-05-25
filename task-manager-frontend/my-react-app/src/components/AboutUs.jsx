import React from "react";

function AboutUs() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-md">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          About Us
        </h2>

        <p className="text-lg text-gray-700 mb-4">
          We are a group of engineering students from{" "}
          <span className="font-bold text-blue-600">
            Deogiri College of Engineering and Management Studies
          </span>
          . Our team consists of four passionate individuals working on a task
          management project as part of our academic work.
        </p>

        <h3 className="text-xl font-medium text-blue-600 mb-2">Team Members:</h3>

        <ul className="list-disc pl-5 text-lg text-gray-700">
          <li>Chirag Kolte</li>
          <li>Rupesh Shinde</li>
          <li>Pranjal Mundada</li>
          <li>Aditya Solanke</li>
        </ul>

        <p className="mt-4 text-sm text-gray-500 text-center">
          This project is created as part of our coursework. We aim to develop
          a functional and intuitive task management application to help users
          organize their tasks efficiently.
        </p>
      </div>
    </div>
  );
}

export default AboutUs;
