const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">Privacy Policy</h1>
      <p className="text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create or modify your account, purchase a course, request customer support, or otherwise communicate with us.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Name and email address</li>
          <li>Billing information (processed securely via Stripe)</li>
          <li>Course progress and quiz results</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">2. How We Use Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, such as to administer your account, provide customer support, and track your progress in courses.</p>
        
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">3. Information Sharing</h2>
        <p>We do not share your personal information with third parties except as described in this privacy policy (e.g., sharing with course instructors regarding your progress, or with payment processors).</p>
        
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">4. Security</h2>
        <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
      </div>
    </div>
  );
};

export default Privacy;
