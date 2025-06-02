export default function StatsSection() {
  const stats = [
    {
      number: "500+",
      label: "Successful Graduates",
      description: "Students who completed our programs and secured employment",
      icon: "fa-graduation-cap",
      color: "blue"
    },
    {
      number: "95%",
      label: "Job Placement Rate", 
      description: "Of our graduates find employment within 6 months",
      icon: "fa-briefcase",
      color: "green"
    },
    {
      number: "50+",
      label: "Industry Partners",
      description: "Companies that trust us for talent acquisition and training",
      icon: "fa-handshake",
      color: "purple"
    },
    {
      number: "₦2.5M",
      label: "Average Salary Increase",
      description: "Career advancement our graduates experience post-training",
      icon: "fa-chart-line",
      color: "orange"
    }
  ];

  const companies = [
    "Microsoft", "Google", "Andela", "Flutterwave", "Paystack", 
    "Interswitch", "Kuda Bank", "Cowrywise", "TechCabal", "Ventures Platform"
  ];

  return (
    <section className="section-padding bg-gray-900 text-white">
      <div className="container-custom">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 bg-${stat.color}-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <i className={`fas ${stat.icon} text-white text-xl`}></i>
              </div>
              <div className="text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-xl font-semibold text-gray-300 mb-2">{stat.label}</div>
              <div className="text-gray-400 text-sm">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Companies Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Our Graduates Work At</h3>
          <p className="text-xl text-gray-300 mb-8">
            Top companies across Nigeria and globally trust our training quality
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {companies.map((company, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 flex items-center justify-center h-16">
                <span className="text-gray-300 font-medium">{company}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12">
          <h3 className="text-3xl font-bold mb-4">Ready to Join Our Success Stories?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Transform your career with industry-relevant skills and personalized support. 
            Your success story starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-white">
              <i className="fas fa-rocket mr-2"></i>
              Start Your Journey
            </button>
            <button className="btn-outline-white">
              <i className="fas fa-phone mr-2"></i>
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 