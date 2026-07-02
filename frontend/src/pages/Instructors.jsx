const Instructors = () => {
  const instructorsList = [
    { name: 'John Doe', role: 'Senior Web Developer', image: 'https://randomuser.me/api/portraits/men/32.jpg', courses: 12, rating: 4.9 },
    { name: 'Sarah Smith', role: 'Data Scientist', image: 'https://randomuser.me/api/portraits/women/44.jpg', courses: 8, rating: 4.8 },
    { name: 'Mike Johnson', role: 'UI/UX Lead', image: 'https://randomuser.me/api/portraits/men/67.jpg', courses: 5, rating: 5.0 },
    { name: 'Emily Davis', role: 'Marketing Expert', image: 'https://randomuser.me/api/portraits/women/68.jpg', courses: 15, rating: 4.7 },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Our Top Instructors</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg">Learn from the best industry experts and professionals.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {instructorsList.map((inst, index) => (
          <div key={index} className="card p-6 flex flex-col items-center text-center group">
            <img src={inst.image} alt={inst.name} className="w-32 h-32 rounded-full mb-4 border-4 border-primary-100 group-hover:border-primary-500 transition-colors object-cover" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{inst.name}</h3>
            <p className="text-primary-600 font-medium mb-4">{inst.role}</p>
            <div className="flex gap-4 text-sm text-slate-500 bg-slate-50 dark:bg-dark-bg px-4 py-2 rounded-full w-full justify-center">
              <span>📚 {inst.courses} Courses</span>
              <span>⭐ {inst.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instructors;
