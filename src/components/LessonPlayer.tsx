import React from "react";

interface LessonPlayerProps {
  videoId: string;
  title: string;
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({ videoId, title }) => {
  return (
    <div className="w-full bg-black aspect-video rounded-lg overflow-hidden shadow-lg">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default LessonPlayer;