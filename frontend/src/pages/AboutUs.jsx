const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-8 text-center">About EduLearn</h1>
      
      <div className="card p-8 md:p-12 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 dark:bg-primary-900/20 rounded-bl-full -z-10"></div>
        <h2 className="text-3xl font-bold text-primary-600 mb-6">Our Mission</h2>
        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          At EduLearn, we believe that education should be accessible to everyone, everywhere. Our mission is to democratize learning by connecting passionate experts with eager students across the globe.
        </p>
        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
          Whether you want to learn programming, master design, or grow your business, we provide the tools, the community, and the platform to help you achieve your goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-8 text-center">
          <div className="text-5xl mb-4">🌍</div>
          <h3 className="text-2xl font-bold mb-3">Global Reach</h3>
          <p className="text-slate-600 dark:text-slate-400">Students from over 150 countries learn on our platform every day.</p>
        </div>
        <div className="card p-8 text-center">
          <div className="text-5xl mb-4">💡</div>
          <h3 className="text-2xl font-bold mb-3">Innovation</h3>
          <p className="text-slate-600 dark:text-slate-400">We constantly update our curriculum to reflect the latest industry trends.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
