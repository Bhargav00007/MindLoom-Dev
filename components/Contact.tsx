"use client";

import React, { useState } from "react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: "b1638040-c697-4b5e-b007-b437e2acd5d5",
        subject: "Contact Form Submission",
        name: formData.name,
        email: formData.email,
        message: formData.message,
      }),
    });

    const result = await response.json();
    if (result.success) {
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6  rounded-lg shadow-md">
      {!submitted ? (
        <>
          <h2 className="text-2xl font-bold mb-4 text-neutral-200">
            Contact The Owner
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 text-white"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-gray-300 p-3 rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border border-gray-300 p-3 rounded"
            />
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="border border-gray-300 p-3 rounded resize-none"
            ></textarea>
            <div className="flex justify-center">
              <button
                type="submit"
                className="cursor-pointer w-60 transform rounded-lg px-6 py-2 font-medium transition-all duration-300 hover:-translate-y-0.5 justify-center items-center bg-white text-black hover:bg-gray-200"
              >
                Send Message
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center text-green-600">
          <h3 className="text-xl font-semibold">Thank you!</h3>
          <p>We&apos;ll be in touch soon.</p>
        </div>
      )}
    </div>
  );
};

export default Contact;
