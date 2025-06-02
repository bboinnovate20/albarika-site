import Image from "next/image";

export default function ContactSection() {
  const contactInfo = [
    {
      icon: "fa-map-marker-alt",
      title: "Visit Our Campus",
      details: ["56, Freeman Street", "Lagos Island, Lagos", "Lagos State, Nigeria"],
      action: "Get Directions"
    },
    {
      icon: "fa-phone",
      title: "Call Us",
      details: ["08092183810", "08028638778", "Mon - Sat: 9AM - 6PM"],
      action: "Call Now"
    },
    {
      icon: "fa-envelope",
      title: "Email Us",
      details: ["albarikacomputercentre@gmail.com",  "We reply within 24hrs"],
      action: "Send Email"
    },
    {
      icon: "fa-comments",
      title: "Live Chat",
      details: ["WhatsApp: 08028638778", "Available 24/7", "Quick responses"],
      action: "Chat Now"
    }
  ];

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to start your learning journey? Have questions about our programs? 
            We're here to help you every step of the way.
          </p>
        </div>

        {/* CEO Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src="/image/ceo.jpeg"
                  alt="Mrs. Kareem Khadijat - CEO"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Mrs. Kareem Khadijat</h3>
              <p className="text-lg text-blue-600 font-semibold mb-3">Chief Executive Officer</p>
              <p className="text-gray-600 leading-relaxed">
                "At Albarika Computer Centre, we are committed to empowering individuals with practical technology skills 
                that open doors to endless opportunities. Our hands-on approach ensures every student gains real-world 
                experience and industry-relevant knowledge."
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Multiple Ways to Reach Us</h3>
            
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-2xl card-hover">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${info.icon} text-blue-600`}></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{info.title}</h4>
                    {info.details.map((detail, idx) => (
                      <div key={idx} className="text-gray-600 text-sm mb-1">{detail}</div>
                    ))}
                    {info.title === "Live Chat" ? (
                      <a 
                        href="https://wa.me/2348028638778?text=Hello%2C%20I%20would%20like%20to%20request%20information%20about%20your%20services%20at%20Albarika%20Computer%20Centre."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-2 inline-block"
                      >
                        {info.action} <i className="fas fa-arrow-right ml-1"></i>
                      </a>
                    ) : (
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-2">
                        {info.action} <i className="fas fa-arrow-right ml-1"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white hover:bg-blue-800 transition-colors">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center text-white hover:bg-pink-700 transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program of Interest
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select a program</option>
                  <option value="programming-class">Programming Class (Web Development)</option>
                  <option value="desktop-publishing-3m">Desktop Publishing (3 months)</option>
                  <option value="desktop-publishing-6m">Desktop Publishing Plus (6 months)</option>
                  <option value="other">Other / General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about your goals, questions, or how we can help you..."
                ></textarea>
              </div>

              <button type="submit" className="w-full btn-primary">
                <i className="fas fa-paper-plane mr-2"></i>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
} 