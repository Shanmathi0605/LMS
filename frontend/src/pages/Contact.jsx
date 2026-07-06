const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-8 text-center">Contact Us</h1>
      <p className="text-slate-600 dark:text-slate-400 text-center mb-12 text-lg">Have questions? We'd love to hear from you.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-8">
          <h2 className="text-2xl font-bold mb-6 text-primary-600">Send us a message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2">Name</label>
              <input type="text" className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2">Email</label>
              <input type="email" className="input-field" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2">Message</label>
              <textarea className="input-field min-h-[120px]" placeholder="How can we help you?"></textarea>
            </div>
            <button type="button" className="btn-primary w-full mt-4">Send Message</button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="card p-8 bg-primary-50 dark:bg-slate-800">
            <h3 className="text-xl font-bold mb-2">Email Us</h3>
            <p className="text-slate-600 dark:text-slate-400">support@skillnova.com</p>
          </div>
          <div className="card p-8 bg-indigo-50 dark:bg-slate-800">
            <h3 className="text-xl font-bold mb-2">Call Us</h3>
            <p className="text-slate-600 dark:text-slate-400">+1 (555) 123-4567</p>
          </div>
          <div className="card p-8 bg-purple-50 dark:bg-slate-800">
            <h3 className="text-xl font-bold mb-2">Office</h3>
            <p className="text-slate-600 dark:text-slate-400">123 Learning Street, Tech City, CA 94016</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
