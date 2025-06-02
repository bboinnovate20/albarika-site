import Link from "next/link";

export default function AboutSection() {
  const features = [
    {
      icon: "fas fa-graduation-cap",
      title: "Expert Instructors",
      description: "Learn from industry professionals with real-world experience"
    },
    {
      icon: "fas fa-laptop-code",
      title: "Hands-on Learning",
      description: "Practice with real projects and build your portfolio"
    },
    {
      icon: "fas fa-certificate",
      title: "Industry Certification",
      description: "Get recognized certifications that employers value"
    },
    {
      icon: "fas fa-users",
      title: "Career Support",
      description: "Lifetime career guidance and job placement assistance"
    }
  ];

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-lightbulb text-blue-600 text-xl"></i>
                </div>
                <span className="text-blue-600 font-semibold text-lg">About Albarika</span>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Empowering minds through 
                <span className="gradient-text"> technology education</span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                For over 8 years, Albarika Computer Centre has been at the forefront of technology education, 
                transforming lives through comprehensive training programs and professional IT services.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <i className="fas fa-check text-green-600 text-sm"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">500+ Successful Graduates</h4>
                  <p className="text-gray-600">Our alumni work in top companies across Nigeria and globally</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <i className="fas fa-check text-green-600 text-sm"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Industry-Relevant Curriculum</h4>
                  <p className="text-gray-600">Our courses are designed with input from industry experts</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <i className="fas fa-check text-green-600 text-sm"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Professional IT Services</h4>
                  <p className="text-gray-600">We also provide consulting and development services to businesses</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="#programs" className="btn-primary text-center">
                <i className="fas fa-book-open mr-2"></i>
                View Our Programs
              </Link>
              <Link href="#contact" className="btn-secondary text-center">
                <i className="fas fa-phone mr-2"></i>
                Get in Touch
              </Link>
            </div>
          </div>

          {/* Right Content - Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <i className={`${feature.icon} text-blue-600 text-xl`}></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 