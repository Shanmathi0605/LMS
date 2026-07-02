const Categories = () => {
  const categoriesList = [
    { name: 'Web Development', icon: '🌐', count: 120 },
    { name: 'Data Science', icon: '📊', count: 85 },
    { name: 'Mobile Design', icon: '📱', count: 45 },
    { name: 'Marketing', icon: '📈', count: 60 },
    { name: 'Photography', icon: '📸', count: 30 },
    { name: 'UI/UX Design', icon: '🎨', count: 75 },
    { name: 'Business', icon: '💼', count: 110 },
    { name: 'Music', icon: '🎵', count: 20 },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Explore Categories</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg">Find the perfect course in your area of interest.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categoriesList.map((cat, index) => (
          <div key={index} className="card p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:-translate-y-2 transition-transform duration-300 group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{cat.name}</h3>
            <p className="text-slate-500">{cat.count} Courses</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
