const Careers = () => {
  const jobs = [
    { title: 'Senior Frontend Developer', type: 'Full-time', location: 'Remote' },
    { title: 'Product Manager', type: 'Full-time', location: 'New York, USA' },
    { title: 'Customer Support Specialist', type: 'Part-time', location: 'Remote' },
    { title: 'UI/UX Designer', type: 'Full-time', location: 'San Francisco, CA' },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-8 text-center">Join Our Team</h1>
      <p className="text-slate-600 dark:text-slate-400 text-center mb-12 text-lg">Help us build the future of education.</p>

      <div className="card p-8 bg-primary-50 dark:bg-slate-800 mb-12">
        <h2 className="text-2xl font-bold text-primary-600 mb-4">Why work with us?</h2>
        <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
          <li>100% remote working options</li>
          <li>Comprehensive health, dental, and vision insurance</li>
          <li>Unlimited paid time off (PTO)</li>
          <li>Annual learning and development budget</li>
        </ul>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Open Positions</h2>
      <div className="space-y-4">
        {jobs.map((job, index) => (
          <div key={index} className="card p-6 flex flex-col sm:flex-row justify-between items-center hover:border-primary-500 transition-colors">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{job.title}</h3>
              <p className="text-slate-500 text-sm">{job.type} &bull; {job.location}</p>
            </div>
            <button className="mt-4 sm:mt-0 px-6 py-2 border-2 border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-slate-700 transition-colors font-medium">Apply Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Careers;
