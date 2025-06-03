import Link from "next/link";

export default function AboutSection() {
  const features = [
    {
      icon: "fas fa-graduation-cap",
      title: "Expert Training",
      description: "Learn from industry professionals with real-world experience"
    },
    {
      icon: "fas fa-laptop-code",
      title: "Professional Services",
      description: "Complete computing solutions for individuals and businesses"
    },
    {
      icon: "fas fa-tools",
      title: "Technical Support",
      description: "Computer maintenance, repair, and data management services"
    },
    {
      icon: "fas fa-users",
      title: "24/7 Availability",
      description: "Round-the-clock support for all your computing needs"
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
                Your Complete 
                <span className="gradient-text"> Computing Solution Partner</span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                For over 8 years, Albarika Computer Centre has been your trusted partner for comprehensive computing solutions. 
                From professional training programs to essential business services, we provide everything you need under one roof.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <i className="fas fa-check text-green-600 text-sm"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">500+ Satisfied Clients</h4>
                  <p className="text-gray-600">Students, businesses, and individuals trust our quality services</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <i className="fas fa-check text-green-600 text-sm"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Comprehensive Service Range</h4>
                  <p className="text-gray-600">Training, document services, maintenance, exam prep & more</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <i className="fas fa-check text-green-600 text-sm"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Expert Technical Support</h4>
                  <p className="text-gray-600">Professional computer maintenance and data management solutions</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="#schools" className="btn-primary text-center">
                <i className="fas fa-cogs mr-2"></i>
                View Our Services
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