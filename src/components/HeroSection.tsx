import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Your Learning Path to{" "}
                <span className="gradient-text">Endless Growth</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                At Albarika Computer Centre, we empower minds through technology education. 
                From programming to graphics design, unlock your potential with our comprehensive training programs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#programs" className="btn-primary text-center">
                <i className="fas fa-play mr-2"></i>
                Start Learning
              </Link>
              <Link href="#about" className="btn-secondary text-center">
                <i className="fas fa-info-circle mr-2"></i>
                Learn More
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Students Trained</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">8+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">15+</div>
                <div className="text-sm text-gray-600">Course Programs</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Visual */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main hero card */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <i className="fas fa-play text-white text-2xl"></i>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Web Development Masterclass</h3>
                <p className="text-gray-600 text-sm mb-4">Learn modern web development from industry experts</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-semibold">₦50,000</span>
                  <div className="flex items-center space-x-1">
                    <i className="fas fa-star text-yellow-400 text-xs"></i>
                    <span className="text-gray-600 text-sm">4.9 (120)</span>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-purple-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
              
              {/* Small cards */}
              <div className="absolute top-0 right-0 bg-white rounded-lg shadow-lg p-3 transform -rotate-12">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-green-600 text-xs"></i>
                  </div>
                  <span className="text-sm font-medium">Certified</span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 bg-white rounded-lg shadow-lg p-3 transform rotate-12">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-users text-blue-600 text-xs"></i>
                  </div>
                  <span className="text-sm font-medium">1,200+ Students</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 