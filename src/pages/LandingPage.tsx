import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Book, Video, FileText, Award, Check } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative gradient-bg py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="md:max-w-2xl lg:max-w-3xl md:pr-10 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Elevate Your Tech Career with Industry-Leading Courses
              </h1>
              <p className="mt-6 text-xl text-white opacity-90">
                Master in-demand skills with our comprehensive courses, mock interviews, and practice tests designed to prepare you for tech industry success.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="bg-white text-brand-600 hover:bg-gray-100 hover:text-brand-700">
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-black border-white hover:bg-white/10 hover:text-white">
                  <Link to="/courses">Explore Courses</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block md:w-full max-w-md mt-10 md:mt-0">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-full h-full bg-white/10 rounded-2xl transform rotate-6"></div>
                <div className="absolute -bottom-6 -right-6 w-full h-full bg-white/10 rounded-2xl transform -rotate-3"></div>
                <div className="relative bg-white rounded-xl shadow-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="Student learning"
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold">Data Structures & Algorithms</h3>
                    <p className="text-gray-500 mt-1 text-sm">Master the fundamentals of DSA for technical interviews</p>
                    <div className="flex items-center mt-4 text-sm">
                      <div className="flex items-center text-brand-600">
                        <Video className="w-4 h-4 mr-1" />
                        <span>24 videos</span>
                      </div>
                      <div className="flex items-center text-brand-600 ml-4">
                        <FileText className="w-4 h-4 mr-1" />
                        <span>5 practice tests</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with our most popular courses designed to help you advance your tech career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Course 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden course-card">
              <div className="course-gradient-1 h-3"></div>
              <div className="p-6">
                <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                  <Book className="text-brand-600 w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Data Structures & Algorithms</h3>
                <p className="mt-2 text-gray-600 text-sm">
                  Master the fundamentals of DSA to excel in technical interviews
                </p>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-500">Beginner to Advanced</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-500">40+ hours</span>
                </div>
              </div>
            </div>

            {/* Course 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden course-card">
              <div className="course-gradient-2 h-3"></div>
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Book className="text-blue-600 w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">JavaScript Mastery</h3>
                <p className="mt-2 text-gray-600 text-sm">
                  Become proficient in JavaScript for modern web development
                </p>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-500">All Levels</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-500">30+ hours</span>
                </div>
              </div>
            </div>

            {/* Course 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden course-card">
              <div className="course-gradient-3 h-3"></div>
              <div className="p-6">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <Book className="text-cyan-600 w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">C++ Programming</h3>
                <p className="mt-2 text-gray-600 text-sm">
                  Learn C++ from basics to advanced concepts for high-performance applications
                </p>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-500">Beginner to Intermediate</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-500">25+ hours</span>
                </div>
              </div>
            </div>

            {/* Course 4 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden course-card">
              <div className="course-gradient-4 h-3"></div>
              <div className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Book className="text-purple-600 w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Communication Skills</h3>
                <p className="mt-2 text-gray-600 text-sm">
                  Enhance your professional communication for tech interviews and workplace success
                </p>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-500">All Levels</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-500">15+ hours</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/courses">View All Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose ElevateCareer</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We're dedicated to helping you achieve your career goals through quality education and practical assessments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                <Video className="text-brand-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Expert-Led Video Courses</h3>
              <p className="mt-2 text-gray-600">
                Learn from industry experts with years of experience in tech companies and education
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="text-brand-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Realistic Mock Tests</h3>
              <p className="mt-2 text-gray-600">
                Practice with carefully crafted assessments that simulate real interview scenarios
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                <Award className="text-brand-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Gamified Learning</h3>
              <p className="mt-2 text-gray-600">
                Stay motivated with points, achievements, and leaderboards as you progress
              </p>
            </div>
          </div>

          <div className="mt-16">
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12">
                  <h3 className="text-2xl font-bold text-gray-900">Ready to advance your career?</h3>
                  <p className="mt-4 text-gray-600">
                    Join thousands of students who have successfully landed their dream tech jobs by mastering our curriculum
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-start">
                      <Check className="text-brand-600 w-5 h-5 mt-0.5 mr-2" />
                      <span>Comprehensive course library covering key tech topics</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-brand-600 w-5 h-5 mt-0.5 mr-2" />
                      <span>Realistic mock tests to assess your knowledge</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-brand-600 w-5 h-5 mt-0.5 mr-2" />
                      <span>Engaging learning experience with achievement system</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Button asChild size="lg">
                      <Link to="/signup">Get Started for Free</Link>
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-200 h-64 md:h-auto relative">
                  <img
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="Person coding"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
