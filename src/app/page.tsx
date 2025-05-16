import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const services = [
    {
      icon: "fas fa-keyboard",
      title: "Data Entry Services",
      description: "Accurate and efficient data entry solutions for businesses of all sizes."
    },
    {
      icon: "fas fa-laptop-code",
      title: "Programming Training",
      description: "Comprehensive web and mobile development courses for beginners and professionals."
    },
    {
      icon: "fas fa-paint-brush",
      title: "Graphics Design",
      description: "Creative design solutions for branding, marketing materials, and digital assets."
    },
    {
      icon: "fas fa-print",
      title: "Computer Typing",
      description: "Professional document formatting and typing services with quick turnaround."
    },
    {
      icon: "fas fa-shopping-cart",
      title: "Office Accessories",
      description: "Quality office supplies and computer accessories for your business needs."
    },
    {
      icon: "fas fa-graduation-cap",
      title: "Academic Projects",
      description: "Expert guidance and development support for student academic projects."
    },
    {
      icon: "fas fa-chalkboard-teacher",
      title: "ICT Training",
      description: "Specialized information and communication technology training programs."
    },
    {
      icon: "fas fa-cogs",
      title: "Technical Support",
      description: "Reliable technical support and maintenance services for your IT infrastructure."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content: "Albarika Computer Centre transformed our business operations with their efficient data entry services. Highly recommended!"
    },
    {
      name: "Michael Okafor",
      role: "Computer Science Student",
      content: "The programming course I took at Albarika gave me practical skills that my university courses didn't cover. Now I'm confidently building my own applications."
    },
    {
      name: "Adeola Bankole",
      role: "Marketing Manager",
      content: "Their graphics design team delivered outstanding branding materials that perfectly captured our company vision. Professional and creative!"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header/Navigation */}
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto px-6 flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Albarika</span>
              <span className="text-2xl font-semibold text-gray-800"> Computer Centre</span>
            </div>
            <div className="md:hidden">
              <button className="text-gray-500 focus:outline-none">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8 mt-4 md:mt-0">
            <Link href="/" className="text-gray-800 hover:text-blue-600 transition duration-300">Home</Link>
            <Link href="#services" className="text-gray-800 hover:text-blue-600 transition duration-300">Services</Link>
            <Link href="#about" className="text-gray-800 hover:text-blue-600 transition duration-300">About Us</Link>
            <Link href="#testimonials" className="text-gray-800 hover:text-blue-600 transition duration-300">Testimonials</Link>
            <Link href="#contact" className="text-gray-800 hover:text-blue-600 transition duration-300">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-6 py-16 md:py-24 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Your IT Solutions Partner</h1>
          <p className="text-xl md:text-2xl text-center mb-8 max-w-2xl">Professional computer services, training, and solutions for businesses and individuals</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#services" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full transition duration-300 text-center">Our Services</Link>
            <Link href="#contact" className="bg-transparent hover:bg-blue-700 border-2 border-white font-semibold py-3 px-8 rounded-full transition duration-300 text-center">Contact Us</Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Services Section */}
        <section id="services" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive IT solutions tailored to meet your business and personal technology needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 transition duration-300 hover:shadow-xl">
                <div className="text-4xl text-blue-600 mb-4">
                  <i className={service.icon}></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="mb-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="relative h-80 w-full">
                <div className="absolute inset-0 bg-blue-200 rounded-lg transform -rotate-3"></div>
                <div className="absolute inset-0 bg-blue-100 rounded-lg transform rotate-3"></div>
                <div className="absolute inset-0 bg-gray-200 rounded-lg">
                  <div className="w-full h-full relative">
                    <Image 
                      src="/api/placeholder/600/400" 
                      alt="Albarika Computer Centre" 
                      layout="fill" 
                      objectFit="cover" 
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">About Albarika Computer Centre</h2>
              <p className="text-gray-600 mb-4">
                Founded with a vision to bridge the technology gap, Albarika Computer Centre has been providing top-notch IT services and training for businesses and individuals alike.
              </p>
              <p className="text-gray-600 mb-4">
                Our team of experienced professionals is dedicated to delivering high-quality solutions that empower our clients to thrive in the digital era. We take pride in our comprehensive approach to IT education and services.
              </p>
              <p className="text-gray-600 mb-6">
                Whether you're looking to enhance your IT skills, need professional data entry services, or require custom software development, we have the expertise and resources to meet your needs.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                    <i className="fas fa-check-circle text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold">Expert Instructors</h3>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                    <i className="fas fa-check-circle text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold">Modern Facilities</h3>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                    <i className="fas fa-check-circle text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold">Hands-on Training</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="mb-20 bg-gray-100 py-12 rounded-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">What Our Clients Say</h2>
            <p className="text-gray-600">Success stories from individuals and businesses we've served</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-blue-600 mb-4 text-4xl">
                  <i className="fas fa-quote-left"></i>
                </div>
                <p className="text-gray-600 mb-4 italic">{testimonial.content}</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center mr-3">
                    <span className="text-blue-700 font-semibold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-20 bg-blue-600 text-white rounded-lg overflow-hidden">
          <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-8 md:mb-0">
                <h2 className="text-3xl font-bold mb-4">Ready to Enhance Your IT Skills?</h2>
                <p className="text-lg">Join our training programs or leverage our professional services today!</p>
              </div>
              <div>
                <Link href="#contact" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full transition duration-300 inline-block">Get Started</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Contact Us</h2>
            <p className="text-gray-600">Reach out to us for inquiries or to schedule a consultation</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
                    <input type="text" id="name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                    <input type="email" id="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-700 mb-2">Subject</label>
                  <input type="text" id="subject" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                  <textarea id="message" rows={4} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"></textarea>
                </div>
                <button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 px-8 rounded-lg transition duration-300">Send Message</button>
              </form>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gray-100 p-6 rounded-lg h-full">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-blue-600 mr-3 mt-1">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold">Address</h4>
                      <p className="text-gray-600">48, Freeman Street, Lagos Island<br />Lagos, Nigeria</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-blue-600 mr-3 mt-1">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <p className="text-gray-600">+234 802 863 8778</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-blue-600 mr-3 mt-1">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-gray-600">albarikacomputercentre@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-blue-600 mr-3 mt-1">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold">Business Hours</h4>
                      <p className="text-gray-600">Monday - Friday: 8:00 AM - 7:30 PM<br />Saturday: 9:00 AM - 7:00 PM</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition duration-300">
                      
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="h-10 w-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition duration-300">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="h-10 w-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition duration-300">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="h-10 w-10 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-900 transition duration-300">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">Albarika Computer Centre</h3>
              <p className="text-gray-400 mb-4">Empowering individuals and businesses through technology education and services.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Data Entry</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Programming Training</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Graphics Design</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Office Accessories</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Academic Projects</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Testimonials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
              <form className="flex flex-col space-y-4">
                <input type="email" placeholder="Your Email Address" className="px-4 py-2 rounded-lg focus:outline-none text-gray-800" />
                <button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition duration-300">Subscribe</button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Albarika Computer Centre. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
