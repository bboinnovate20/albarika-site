export default function ProgramsSection() {
  const programs = [
    {
      title: "Full Stack Web Development",
      duration: "6 months",
      level: "Beginner to Advanced",
      price: "₦80,000",
      description: "Complete web development training covering frontend, backend, and deployment.",
      features: ["HTML, CSS, JavaScript", "React.js & Node.js", "Database Management", "Project Portfolio", "Job Placement Support"],
      popular: true,
      icon: "fa-globe"
    },
    {
      title: "Graphics Design Masterclass",
      duration: "4 months", 
      level: "Beginner to Professional",
      price: "₦65,000",
      description: "Comprehensive graphics design training for print and digital media.",
      features: ["Adobe Creative Suite", "Logo & Brand Design", "Print Design", "Digital Marketing Graphics", "Client Project Experience"],
      popular: false,
      icon: "fa-paint-brush"
    },
    {
      title: "Data Science & Analytics",
      duration: "5 months",
      level: "Intermediate to Advanced", 
      price: "₦90,000",
      description: "Master data analysis, visualization, and machine learning techniques.",
      features: ["Python & R Programming", "Statistical Analysis", "Machine Learning", "Data Visualization", "Real-world Projects"],
      popular: false,
      icon: "fa-chart-line"
    },
    {
      title: "Mobile App Development",
      duration: "5 months",
      level: "Intermediate",
      price: "₦85,000", 
      description: "Build native and cross-platform mobile applications.",
      features: ["React Native", "Flutter Development", "API Integration", "App Store Publishing", "Monetization Strategies"],
      popular: false,
      icon: "fa-mobile-alt"
    },
    {
      title: "Digital Marketing Bootcamp",
      duration: "3 months",
      level: "Beginner to Intermediate",
      price: "₦55,000",
      description: "Complete digital marketing strategy and implementation training.",
      features: ["Social Media Marketing", "Google Ads & Analytics", "Content Strategy", "Email Marketing", "Campaign Management"],
      popular: false,
      icon: "fa-bullhorn"
    },
    {
      title: "UI/UX Design Workshop",
      duration: "4 months",
      level: "Beginner to Professional",
      price: "₦70,000",
      description: "Design user-centered digital experiences and interfaces.",
      features: ["Design Thinking", "Figma & Adobe XD", "User Research", "Prototyping", "Design Systems"],
      popular: false,
      icon: "fa-pencil-ruler"
    }
  ];

  return (
    <section id="programs" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Training Programs</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive, hands-on training programs designed to give you practical skills 
            and real-world experience in today's most in-demand technologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg card-hover relative ${program.popular ? 'ring-2 ring-blue-600' : ''}`}>
              {program.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className={`fas ${program.icon} text-blue-600 text-xl`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{program.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span><i className="fas fa-clock mr-1"></i>{program.duration}</span>
                    <span><i className="fas fa-signal mr-1"></i>{program.level}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{program.description}</p>

              <div className="space-y-3 mb-8">
                {program.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <i className="fas fa-check text-green-600 text-sm"></i>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-gray-900">{program.price}</span>
                  <span className="text-gray-600 text-sm">Full Program</span>
                </div>
                
                <button className={`w-full ${program.popular ? 'btn-primary' : 'btn-secondary'}`}>
                  <i className="fas fa-shopping-cart mr-2"></i>
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Need a custom program for your organization?</p>
          <button className="btn-outline-blue">
            <i className="fas fa-users mr-2"></i>
            Request Corporate Training
          </button>
        </div>
      </div>
    </section>
  );
} 