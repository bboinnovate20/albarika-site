export default function MasterclassesSection() {
  const masterclasses = [
    {
      title: "AI & Machine Learning Fundamentals",
      instructor: "Dr. Sarah Johnson",
      date: "March 15, 2024",
      time: "2:00 PM - 5:00 PM",
      price: "₦15,000",
      duration: "3 hours",
      level: "Intermediate",
      description: "Dive deep into artificial intelligence and machine learning concepts with hands-on Python implementation.",
      topics: ["Neural Networks", "Deep Learning", "TensorFlow", "Real-world AI Applications"],
      seats: "8 seats left",
      featured: true
    },
    {
      title: "Advanced React.js Patterns",
      instructor: "Michael Chen",
      date: "March 22, 2024", 
      time: "10:00 AM - 1:00 PM",
      price: "₦12,000",
      duration: "3 hours",
      level: "Advanced",
      description: "Master advanced React patterns and performance optimization techniques used in production applications.",
      topics: ["Custom Hooks", "Context Patterns", "Performance Optimization", "State Management"],
      seats: "12 seats left",
      featured: false
    },
    {
      title: "Blockchain Development Workshop",
      instructor: "David Okafor",
      date: "March 29, 2024",
      time: "1:00 PM - 6:00 PM", 
      price: "₦20,000",
      duration: "5 hours",
      level: "Intermediate",
      description: "Build your first decentralized application (DApp) and understand blockchain fundamentals.",
      topics: ["Smart Contracts", "Solidity", "Web3.js", "DApp Development"],
      seats: "5 seats left",
      featured: false
    },
    {
      title: "UI/UX Design Thinking Workshop",
      instructor: "Adeola Bankole",
      date: "April 5, 2024",
      time: "9:00 AM - 4:00 PM",
      price: "₦18,000", 
      duration: "7 hours",
      level: "Beginner to Intermediate",
      description: "Learn design thinking methodology and create user-centered digital experiences.",
      topics: ["User Research", "Wireframing", "Prototyping", "Usability Testing"],
      seats: "15 seats left",
      featured: false
    }
  ];

  return (
    <section id="masterclasses" className="section-padding bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Exclusive Masterclasses</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Intensive, hands-on workshops led by industry experts. Perfect for professionals 
            looking to quickly master specific skills or explore new technologies.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {masterclasses.map((masterclass, index) => (
            <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg card-hover relative ${masterclass.featured ? 'ring-2 ring-purple-500' : ''}`}>
              {masterclass.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{masterclass.title}</h3>
                  <p className="text-gray-600 mb-4">{masterclass.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span><i className="fas fa-user mr-1"></i>{masterclass.instructor}</span>
                    <span><i className="fas fa-signal mr-1"></i>{masterclass.level}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{masterclass.price}</div>
                  <div className="text-sm text-gray-600">{masterclass.duration}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Date & Time</div>
                  <div className="font-medium text-gray-900">{masterclass.date}</div>
                  <div className="text-sm text-gray-600">{masterclass.time}</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Availability</div>
                  <div className="font-medium text-orange-600">{masterclass.seats}</div>
                  <div className="text-sm text-gray-600">Limited spots</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-medium text-gray-900 mb-3">What you'll learn:</div>
                <div className="grid grid-cols-2 gap-2">
                  {masterclass.topics.map((topic, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <i className="fas fa-check text-green-600 text-xs"></i>
                      <span className="text-gray-700 text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className={`w-full ${masterclass.featured ? 'btn-primary' : 'btn-secondary'}`}>
                <i className="fas fa-calendar-plus mr-2"></i>
                Reserve Your Spot
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Want to suggest a masterclass topic?</p>
          <button className="btn-outline-purple">
            <i className="fas fa-lightbulb mr-2"></i>
            Request Custom Masterclass
          </button>
        </div>
      </div>
    </section>
  );
} 