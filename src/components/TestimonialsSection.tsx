export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Musa Ibrahim",
      role: "Staff",
      content: "Albarika's mobile development course gave me the skills to build apps that users love. The mentorship and practical projects made all the difference.",
      rating: 5,
      avatar: "M"
    },
    {
      name: "Habeeb",
      role: "Staff",
      content: "The design thinking approach taught at Albarika revolutionized how I approach user experience. Now I create designs that truly solve user problems.",
      rating: 5,
      avatar: "H"
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Learners say we know our onions</h2>
          <p className="text-xl text-gray-600">See what our students and industry partners have to say</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg card-hover">
              <div className="flex items-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i key={star} className="fas fa-star text-yellow-400"></i>
                ))}
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{testimonial.avatar}</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 