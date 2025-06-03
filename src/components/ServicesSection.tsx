import Link from "next/link";

export default function ServicesSection() {
  const services = [
    {
      id: "document-services",
      title: "Document Services",
      description: "Professional typing, scanning & printing solutions",
      icon: "fas fa-file-alt",
      color: "bg-orange-500",
      services: ["Document Typing", "Scanning Services", "Photocopying", "Laminating Services", "Professional Typist Services"],
      duration: "On Demand"
    },
    {
      id: "form-registration",
      title: "Online Registration",
      description: "Website form registration and online applications",
      icon: "fas fa-laptop",
      color: "bg-green-500",
      services: ["JAMB Registration", "WAEC Registration", "University Applications", "Job Applications", "Government Forms"],
      duration: "Instant"
    },
    {
      id: "exam-preparation",
      title: "Exam Preparation",
      description: "JAMB & WAEC computer-based test preparation",
      icon: "fas fa-graduation-cap",
      color: "bg-red-500",
      services: ["JAMB CBT Training", "WAEC Preparation", "Practice Tests", "Mock Examinations", "Result Checking"],
      duration: "Flexible"
    },
    {
      id: "computer-maintenance",
      title: "Computer Maintenance",
      description: "Expert computer repair and technical support",
      icon: "fas fa-tools",
      color: "bg-indigo-500",
      services: ["Hardware Repair", "Software Installation", "Virus Removal", "System Optimization", "Network Setup"],
      duration: "Same Day"
    },
    {
      id: "data-entry",
      title: "Data Entry Management",
      description: "Professional data entry and management services",
      icon: "fas fa-database",
      color: "bg-purple-500",
      services: ["Data Entry", "Database Management", "Excel Spreadsheets", "Record Keeping", "Data Analysis"],
      duration: "24-48 Hours"
    },
    {
      id: "project-creation",
      title: "Project Creation",
      description: "Academic and business project development",
      icon: "fas fa-project-diagram",
      color: "bg-blue-500",
      services: ["Student Projects", "Business Proposals", "Research Papers", "Presentations", "Report Writing"],
      duration: "1-7 Days"
    }
  ];

  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Computing Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional computing services designed to meet your daily business and academic needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link 
              key={service.id}
              href={`#contact`}
              className="bg-white shadow-lg rounded-2xl p-6 block hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-blue-200"
            >
              <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${service.icon} text-white text-xl`}></i>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-4 text-sm">
                {service.description}
              </p>
              
              <div className="flex items-center justify-end mb-4">
                <span className="text-sm text-gray-500">({service.duration})</span>
              </div>
              
              <div className="space-y-2 mb-6">
                {service.services.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <i className="fas fa-check text-green-600 text-sm"></i>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                Get Service
                <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Need a custom service not listed above?</p>
          <Link href="#contact" className="btn-primary">
            <i className="fas fa-phone mr-2"></i>
            Contact Us for Custom Solutions
          </Link>
        </div>
      </div>
    </section>
  );
} 