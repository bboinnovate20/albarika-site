import Link from "next/link";

export default function Footer() {
  const quickLinks = [
    { name: "About Us", href: "#about" },
    { name: "Our Programs", href: "#programs" },
    { name: "Masterclasses", href: "#masterclasses" },
    { name: "Success Stories", href: "#testimonials" },
    { name: "Contact Us", href: "#contact" },
    { name: "Blog", href: "/blog" }
  ];

  const programs = [
    { name: "Full Stack Web Development", href: "#programs" },
    { name: "Graphics Design", href: "#programs" },
    { name: "Desktop Publishing", href: "#programs" },
    // { name: "Data Science & Analytics", href: "#programs" },
    // { name: "Mobile App Development", href: "#programs" },
    // { name: "Digital Marketing", href: "#programs" },
    // { name: "UI/UX Design", href: "#programs" }
  ];

  const resources = [
    { name: "Student Portal", href: "/portal" },
    { name: "Course Catalog", href: "/catalog" },
    { name: "Career Services", href: "/careers" },
    { name: "Alumni Network", href: "/alumni" },
    { name: "Downloads", href: "/downloads" },
    { name: "FAQ", href: "/faq" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-graduation-cap text-white text-lg"></i>
              </div>
              <div>
                <span className="text-xl font-bold">Albarika</span>
                <span className="text-sm text-gray-400 block -mt-1">Computer Centre</span>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering the next generation of tech professionals with industry-relevant 
              skills and hands-on experience since 2016.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <i className="fas fa-map-marker-alt text-blue-400 w-4"></i>
                <span className="text-gray-400 text-sm">56, Freeman Street, Lagos Island, Lagos</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-phone text-blue-400 w-4"></i>
                <span className="text-gray-400 text-sm">+234 802 863 8778</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-envelope text-blue-400 w-4"></i>
                <span className="text-gray-400 text-sm">albarikacomputercentre@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Our Programs</h3>
            <ul className="space-y-3">
              {programs.map((program, index) => (
                <li key={index}>
                  <Link 
                    href={program.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {program.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3 mb-6">
              {resources.map((resource, index) => (
                <li key={index}>
                  <Link 
                    href={resource.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold mb-3">Stay Updated</h4>
              <p className="text-gray-400 text-sm mb-4">
                Get the latest updates on new programs and opportunities.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500 text-sm"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors">
                  <i className="fas fa-arrow-right text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Albarika Computer Centre. All rights reserved.
            </div>
            
            {/* Social Media */}
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-colors">
                <i className="fab fa-facebook-f text-sm"></i>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-400 transition-colors">
                <i className="fab fa-twitter text-sm"></i>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-700 transition-colors">
                <i className="fab fa-linkedin-in text-sm"></i>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-pink-600 transition-colors">
                <i className="fab fa-instagram text-sm"></i>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-colors">
                <i className="fab fa-youtube text-sm"></i>
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 