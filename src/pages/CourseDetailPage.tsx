
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCourseById } from "@/data/courses";
import { Course, Video } from "@/types";
import { Clock, Calendar, Award, PlayCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, updateUserPoints } = useAuth();

  useEffect(() => {
    if (courseId) {
      const fetchedCourse = getCourseById(courseId);
      setCourse(fetchedCourse);
      if (fetchedCourse && fetchedCourse.videos.length > 0) {
        setActiveVideo(fetchedCourse.videos[0]);
      }
      setIsLoading(false);
    }
  }, [courseId]);

  const handleVideoSelect = (video: Video) => {
    setActiveVideo(video);
  };

  const handleCompleteCourse = async () => {
    if (!courseId || !user) return;

    try {
      // Record course completion in Supabase
      const { error } = await supabase
        .from('completed_courses')
        .insert({
          user_id: user.id,
          course_id: courseId
        });

      if (error) {
        console.error("Error marking course as complete:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to mark course as complete."
        });
        return;
      }

      // Update user points
      if (course?.pointsReward) {
        await updateUserPoints(course.pointsReward);
      }

      toast({
        title: "Course Completed!",
        description: `Congratulations! You've earned ${course?.pointsReward || 0} points.`
      });

    } catch (error) {
      console.error("Error completing course:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while completing the course."
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!course) {
    return <div className="flex justify-center items-center min-h-screen">Course not found</div>;
  }

  const watchedCount = course.videos.filter(video => video.watched).length;
  const progress = (watchedCount / course.videos.length) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/courses">Courses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{course.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Content - Left Side */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <Award size={16} className="mr-1" />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>Updated 2 months ago</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <Button 
                onClick={handleCompleteCourse} 
                disabled={progress < 100}
                className="w-full"
              >
                {progress < 100 ? "Complete All Videos to Finish Course" : "Mark Course as Completed"}
              </Button>
            </div>
            
            {activeVideo && (
              <div className="mb-6">
                <div className="bg-gray-900 aspect-video rounded-lg flex items-center justify-center mb-4">
                  <div className="relative w-full h-0 pb-[56.25%]">
                    <iframe 
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src={`https://www.youtube.com/embed/${activeVideo.youtubeId}`}
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-2">{activeVideo.title}</h2>
                <p className="text-gray-600">{activeVideo.description}</p>
              </div>
            )}
            
            <div>
              <Tabs defaultValue="about">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
                  <TabsTrigger value="resources" className="flex-1">Resources</TabsTrigger>
                  <TabsTrigger value="discussion" className="flex-1">Discussion</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="p-4">
                  <h3 className="text-lg font-semibold mb-3">About This Course</h3>
                  <p className="mb-4">{course.description}</p>
                  
                  <h3 className="text-lg font-semibold mb-3">What You'll Learn</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Master the fundamentals of {course.title}</li>
                    <li>Apply concepts to real-world problems</li>
                    <li>Build confidence in technical interviews</li>
                    <li>Develop problem-solving skills</li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="resources" className="p-4">
                  <h3 className="text-lg font-semibold mb-3">Course Resources</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <a href="#" className="text-brand-600 hover:text-brand-800 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        Course Slides PDF
                      </a>
                    </li>
                    <li className="flex items-center">
                      <a href="#" className="text-brand-600 hover:text-brand-800 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        Practice Exercises
                      </a>
                    </li>
                    <li className="flex items-center">
                      <a href="#" className="text-brand-600 hover:text-brand-800 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Code Samples GitHub Repo
                      </a>
                    </li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="discussion" className="p-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold mb-2">Join the Discussion</h3>
                    <p className="mb-4 text-gray-600">Share your thoughts, ask questions, and connect with other learners.</p>
                    <Button variant="outline">Log in to Comment</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Course Sidebar - Right Side */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-20">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-xl">Course Content</h2>
                <p className="text-sm text-gray-600">{course.videos.length} videos • {course.duration}</p>
              </div>
              
              <div className="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto">
                {course.videos.map((video, index) => (
                  <button
                    key={video.id}
                    onClick={() => handleVideoSelect(video)}
                    className={`w-full text-left p-4 hover:bg-gray-50 flex items-start transition-colors ${activeVideo?.id === video.id ? 'bg-gray-50' : ''}`}
                  >
                    <div className="mr-3 mt-1 flex-shrink-0">
                      {video.watched ? (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 flex items-center justify-center">
                          <PlayCircle size={20} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${activeVideo?.id === video.id ? 'text-brand-600' : ''}`}>
                        {index + 1}. {video.title}
                      </p>
                      <p className="text-xs text-gray-500">{video.duration}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CourseDetailPage;
