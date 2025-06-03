import Link from "next/link";

export default function SchoolsSection() {
  const schools = [
    {
      id: "web-dev",
      title: "Web Development",
      description: "Master modern web technologies and frameworks",
      icon: "fas fa-code",
      color: "bg-blue-500",
      courses: ["HTML/CSS", "JavaScript", "React", "Node.js"]
    },
    {
      id: "graphics",
      title: "Graphics Design",
      description: "Create stunning visual designs and artwork",
      icon: "fas fa-paint-brush",
      color: "bg-purple-500",
      courses: ["Photoshop", "Illustrator", "CorelDraw", "UI/UX"]
    },
    {
      id: "data-science",
      title: "Data Science",
      description: "Analyze data and build intelligent systems",
      icon: "fas fa-chart-line",
      color: "bg-green-500",
      courses: ["Python", "Machine Learning", "SQL", "Tableau"]
    },
    {
      id: "cyber-security",
      title: "Cybersecurity",
      description: "Protect systems and networks from threats",
      icon: "fas fa-shield-alt",
      color: "bg-red-500",
      courses: ["Network Security", "Ethical Hacking", "Risk Assessment", "Compliance"]
    }
  ];

  return (
    <section id="schools" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Learning Schools</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our specialized schools designed to give you expertise in high-demand technology fields
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {schools.map((school) => (
            <Link 
              key={school.id}
              href={`#programs`}
              className="shadow-2xl rounded-2xl p-12 block"
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
              
              <div className="flex flex-wrap gap-1 mb-4">
                {school.courses.map((course, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                  >
                    {course}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                Learn More
                <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 