
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { getCourseById } from "@/data/courses";
import { Course, Video } from "@/types";
import { Clock, Calendar, Award, PlayCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, updateUserPoints } = useAuth();
  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);

  useEffect(() => {
    if (courseId) {
      const courseData = getCourseById(courseId);
      if (courseData) {
        setCourse(courseData);
        if (courseData.videos.length > 0) {
          setSelectedVideo(courseData.videos[0]);
        }
      } else {
        navigate("/courses");
      }
    }
  }, [courseId, navigate]);

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    if (!watchedVideos.includes(video.id)) {
      setWatchedVideos([...watchedVideos, video.id]);
    }
  };

  const handleCompleteVideo = () => {
    if (selectedVideo && !watchedVideos.includes(selectedVideo.id)) {
      const updatedWatchedVideos = [...watchedVideos, selectedVideo.id];
      setWatchedVideos(updatedWatchedVideos);
      
      // Check if all videos have been watched
      if (course && updatedWatchedVideos.length === course.videos.length) {
        updateUserPoints(course.pointsReward);
        toast({
          title: "Course Completed!",
          description: `You've earned ${course.pointsReward} points for completing this course.`
        });
      }
    }
  };

  const isVideoWatched = (videoId: string) => watchedVideos.includes(videoId);

  if (!course) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const progress = course.videos.length > 0 
    ? Math.round((watchedVideos.length / course.videos.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Course Header */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="h-64 bg-gray-200 relative">
              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end">
                <div className="p-6 w-full">
                  <Badge className="mb-2">{course.category}</Badge>
                  <h1 className="text-white text-3xl font-bold">{course.title}</h1>
                  
                  <div className="flex flex-wrap gap-4 mt-3 text-white">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{course.level}</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      <span>{course.pointsReward} points</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Video Player */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="videos" className="mb-8">
                <TabsList className="mb-4">
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="videos" className="space-y-6">
                  {selectedVideo ? (
                    <>
                      <div className="youtube-container">
                        <iframe
                          src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                          title={selectedVideo.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      
                      <div>
                        <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
                        <p className="mt-2 text-gray-600">{selectedVideo.description}</p>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{selectedVideo.duration}</span>
                          </div>
                          <Button 
                            onClick={handleCompleteVideo}
                            disabled={isVideoWatched(selectedVideo.id)}
                            variant={isVideoWatched(selectedVideo.id) ? "outline" : "default"}
                          >
                            {isVideoWatched(selectedVideo.id) ? "Completed" : "Mark as Completed"}
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p>No videos available for this course.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="overview">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold mb-4">About this Course</h2>
                      <p className="text-gray-700">{course.description}</p>
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2">What You'll Learn</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Comprehensive understanding of {course.category} concepts</li>
                          <li>Practical skills applicable in real-world scenarios</li>
                          <li>Tips and tricks for technical interviews</li>
                          <li>Industry best practices and standards</li>
                        </ul>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2">Prerequisites</h3>
                        <p className="text-gray-700">
                          {course.level === "Beginner" ? "No prior knowledge required" : 
                           course.level === "Intermediate" ? "Basic understanding of the subject" : 
                           "Strong foundation in the fundamentals"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar - Course Progress & Videos List */}
            <div>
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-2">Your Progress</h3>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-600 rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {watchedVideos.length} of {course.videos.length} videos completed ({progress}%)
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Course Content</h3>
                  <div className="space-y-3">
                    {course.videos.map((video) => (
                      <button
                        key={video.id}
                        className={`w-full flex items-start p-3 rounded-lg text-left ${
                          selectedVideo?.id === video.id 
                            ? 'bg-brand-50 border border-brand-200' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleVideoSelect(video)}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <PlayCircle className={`h-5 w-5 ${
                            isVideoWatched(video.id) ? 'text-green-500' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="ml-3">
                          <p className={`font-medium ${
                            selectedVideo?.id === video.id ? 'text-brand-700' : 'text-gray-900'
                          }`}>
                            {video.title}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">{video.duration}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseDetailPage;
