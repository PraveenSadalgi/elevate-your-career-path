
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { coursesData } from "@/data/courses";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, updateUserPoints } = useAuth();
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const course = coursesData.find((c) => c.id === courseId);

  useEffect(() => {
    if (!user || !course) return;
    
    // Check if the course is already completed by this user
    const checkCompletion = async () => {
      try {
        const { data, error } = await supabase
          .from('completed_courses')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', course.id);
          
        if (error) {
          console.error("Error checking course completion:", error);
          return;
        }
        
        if (data && data.length > 0) {
          setIsCompleted(true);
          setProgress(100);
        } else {
          // For demo purposes, we'll set a random progress
          setProgress(Math.floor(Math.random() * 60));
        }
      } catch (error) {
        console.error("Error checking course completion:", error);
      }
    };
    
    checkCompletion();
  }, [courseId, user]);
  
  const handleCompleteCourse = async () => {
    if (!user || !course || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Record course completion in the database
      const { error } = await supabase
        .from('completed_courses')
        .insert({
          user_id: user.id,
          course_id: course.id
        });
        
      if (error) {
        console.error("Error recording course completion:", error);
        toast({
          variant: "destructive",
          title: "Error completing course",
          description: "There was a problem recording your progress."
        });
        return;
      }
      
      // Update user points (courses give 50 points)
      await updateUserPoints(50);
      
      setIsCompleted(true);
      setProgress(100);
      
      toast({
        title: "Course Completed!",
        description: `Congratulations! You've earned 50 points for completing ${course.title}.`
      });
      
    } catch (error) {
      console.error("Error completing course:", error);
      toast({
        variant: "destructive",
        title: "Error completing course",
        description: "There was a problem recording your progress."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
            <p className="mt-2 text-gray-600">The course you're looking for doesn't exist.</p>
            <Button className="mt-4">
              <Link to="/courses">Return to Courses</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Course Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
            <div>
              <Link 
                to="/courses"
                className="text-brand-600 hover:text-brand-500 mb-4 inline-flex items-center"
              >
                ← Back to Courses
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="mt-2 text-xl text-gray-600">{course.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-800">
                  {course.level}
                </span>
                <span className="text-sm text-gray-500">{course.duration}</span>
                <span className="text-sm text-gray-500">{course.lessonsCount} lessons</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              {isCompleted ? (
                <Button variant="outline" disabled className="bg-green-50 text-green-700 border-green-200">
                  Completed
                </Button>
              ) : (
                <Button onClick={handleCompleteCourse} disabled={isLoading}>
                  {isLoading ? "Completing..." : "Mark as Complete"}
                </Button>
              )}
            </div>
          </div>
          
          {/* Course Progress */}
          <Card className="mb-8 p-6">
            <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
            <div className="flex items-center">
              <Progress value={progress} className="h-2 flex-grow mr-4" />
              <span className="text-sm font-medium">{progress}%</span>
            </div>
          </Card>
          
          {/* Course Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Course Overview</h2>
                <p className="text-gray-700">
                  This comprehensive course is designed to help you master the fundamentals and advanced concepts 
                  of {course.title}. Through practical examples and hands-on exercises, you'll gain the skills 
                  needed to excel in your career.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">What You'll Learn</h2>
                <ul className="space-y-2">
                  {course.learningPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-1 text-brand-600">•</span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Course Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Instructor</h3>
                    <p className="mt-1 text-gray-900">{course.instructor}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                    <p className="mt-1 text-gray-900">{course.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                    <p className="mt-1 text-gray-900">{course.updatedAt}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-1 text-brand-600">•</span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseDetailPage;
