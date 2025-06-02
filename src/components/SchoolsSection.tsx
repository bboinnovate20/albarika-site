import Link from "next/link";

export default function SchoolsSection() {
  const schools = [
    {
      id: "programming",
      title: "Programming Class",
      description: "Web Development - Basic & Programming",
      icon: "fas fa-code",
      color: "bg-blue-500",
      courses: ["Introduction to HTML & CSS", "Javascript Programming", "Website Design & Deployment"],
      price: "₦100,000",
      duration: "4 months"
    },
    {
      id: "desktop-publishing-3m",
      title: "Desktop Publishing",
      description: "Essential computer skills and design fundamentals",
      icon: "fas fa-desktop",
      color: "bg-green-500",
      courses: ["Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint", "CorelDraw Graphics Design"],
      price: "₦30,000",
      duration: "3 months"
    },
    {
      id: "desktop-publishing-6m",
      title: "Desktop Publishing Plus",
      description: "Extended desktop publishing with advanced skills",
      icon: "fas fa-laptop",
      color: "bg-purple-500",
      courses: ["Microsoft Word (Advanced)", "Microsoft Excel (Advanced)", "Microsoft PowerPoint (Pro)", "CorelDraw Graphics Design (Complete)"],
      price: "₦60,000",
      duration: "6 months"
    }
  ];

  return (
    <section id="schools" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Training Programs</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our specialized programs designed to give you practical computer skills and programming expertise
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schools.map((school) => (
            <Link 
              key={school.id}
              href={`#contact`}
              className="bg-white shadow-lg rounded-2xl p-6 block hover:shadow-xl transition-shadow duration-300 group border border-gray-100"
            >
              <div className={`w-12 h-12 ${school.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${school.icon} text-white text-xl`}></i>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {school.title}
              </h3>
              
              <p className="text-gray-600 mb-4 text-sm">
                {school.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-blue-600">{school.price}</span>
                <span className="text-sm text-gray-500">({school.duration})</span>
              </div>
              
              <div className="space-y-2 mb-6">
                {school.courses.map((course, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <i className="fas fa-check text-green-600 text-sm"></i>
                    <span className="text-sm text-gray-700">{course}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                Enroll Now
                <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 