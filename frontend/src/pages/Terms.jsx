const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">Terms of Service</h1>
      <p className="text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">1. Introduction</h2>
        <p>Welcome to SkillNova. By accessing our website, you agree to these Terms of Service. Please read them carefully.</p>
        
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">2. User Accounts</h2>
        <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.</p>
        
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">3. Intellectual Property</h2>
        <p>The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of SkillNova and its licensors.</p>
        
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">4. Payment and Refunds</h2>
        <p>For paid courses, we offer a 30-day money-back guarantee. After 30 days, all sales are final.</p>
        
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">5. Termination</h2>
        <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
      </div>
    </div>
  );
};

export default Terms;
