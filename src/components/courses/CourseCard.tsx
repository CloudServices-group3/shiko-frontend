import Image from "next/image";

type CourseCardProps = {
  id: number;
  title: string;
  imageUrl: string;
  lessonCount: number;
  duration: string;
};

export default function CourseCard({ id, title, imageUrl, lessonCount, duration }: CourseCardProps) {
    async function handleViewDetailsClick() {
    await fetch("http://localhost:5287/api/popular-courses/click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: id.toString(),
        title,
        description: `${lessonCount} Lesson • ${duration}`,
        iconUrl: "/icons/popular-this-week/default.svg",
      }),
    });
  }
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{lessonCount} Lesson</span>
            <span>{duration}</span>
          </div>
          <button onClick={handleViewDetailsClick} className="bg-orange-500 text-white text-sm px-4 py-1.5 rounded-lg">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}