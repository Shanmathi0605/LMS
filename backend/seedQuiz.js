import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from './models/Quiz.js';
import Course from './models/Course.js';

dotenv.config();

const domainQuestions = {
  "Web Development": [
    { questionText: "What does HTML stand for?", options: ["Hyper Text Preprocessor", "Hyper Text Markup Language", "Hyper Text Multiple Language", "Hyper Tool Multi Language"], correctAnswerIndex: 1 },
    { questionText: "Which CSS property controls text size?", options: ["text-style", "font-style", "text-size", "font-size"], correctAnswerIndex: 3 },
    { questionText: "Which HTML tag is used for JavaScript?", options: ["<script>", "<js>", "<javascript>", "<scripting>"], correctAnswerIndex: 0 }
  ],
  "Data Science": [
    { questionText: "Which language is most commonly used for Data Science?", options: ["Java", "Python", "C++", "PHP"], correctAnswerIndex: 1 },
    { questionText: "What does EDA stand for?", options: ["Exploratory Data Analysis", "External Data Array", "Extended Data Analytics", "Exploratory Deep Analysis"], correctAnswerIndex: 0 },
    { questionText: "Which library is used for data manipulation in Python?", options: ["Numpy", "Pandas", "Matplotlib", "Seaborn"], correctAnswerIndex: 1 }
  ],
  "Design": [
    { questionText: "Which color mode is used for digital screens?", options: ["CMYK", "RGB", "Grayscale", "Pantone"], correctAnswerIndex: 1 },
    { questionText: "What does UI stand for?", options: ["Universal Interface", "User Interface", "User Interaction", "Unified Integration"], correctAnswerIndex: 1 },
    { questionText: "Which software is considered industry standard for vector graphics?", options: ["Photoshop", "Figma", "Illustrator", "Premiere Pro"], correctAnswerIndex: 2 }
  ],
  "Business": [
    { questionText: "What does ROI stand for?", options: ["Return on Investment", "Rate of Interest", "Ratio of Income", "Return on Income"], correctAnswerIndex: 0 },
    { questionText: "Which of these is a key element of a business plan?", options: ["Color Palette", "Market Analysis", "Code Structure", "Server Costs"], correctAnswerIndex: 1 },
    { questionText: "What is a 'Target Audience'?", options: ["People who don't buy products", "Specific group of consumers intended for a product", "Shareholders of the company", "Employees of a rival company"], correctAnswerIndex: 1 }
  ],
  "Marketing": [
    { questionText: "What does SEO stand for?", options: ["Search Engine Optimization", "Social Engagement Organizer", "System Error Output", "Sales Engagement Operations"], correctAnswerIndex: 0 },
    { questionText: "Which of these is a social media marketing platform?", options: ["Excel", "Instagram", "Visual Studio", "AWS"], correctAnswerIndex: 1 },
    { questionText: "What is a Call to Action (CTA)?", options: ["A legal document", "A prompt telling the user to take a specified action", "A type of advertisement cost", "A strategy meeting"], correctAnswerIndex: 1 }
  ]
};

const genericQuestions = [
  { questionText: "What is the primary goal of this course's topic?", options: ["To understand core fundamentals", "To skip directly to advanced usage", "To memorize facts without practice", "To ignore industry standards"], correctAnswerIndex: 0 },
  { questionText: "Which of the following is essential for mastering this subject?", options: ["Copying others' work", "Consistent practice and review", "Reading once and never applying", "Using only one source of truth"], correctAnswerIndex: 1 },
  { questionText: "How should you approach complex problems in this domain?", options: ["Give up immediately", "Break them down into smaller manageable parts", "Guess randomly", "Wait for someone else to solve it"], correctAnswerIndex: 1 }
];

const seedAllQuizzes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const courses = await Course.find();
    
    if (courses.length === 0) {
      console.log('No courses found!');
      process.exit(1);
    }

    await Quiz.deleteMany();
    
    let count = 0;

    for (let course of courses) {
      // Find matching domain or default to generic
      let questionsToUse = genericQuestions;
      
      for (const [domain, questions] of Object.entries(domainQuestions)) {
        if (course.category && course.category.includes(domain)) {
          questionsToUse = questions;
          break;
        } else if (course.title && course.title.includes(domain)) {
           questionsToUse = questions;
           break;
        }
      }

      const sampleQuiz = new Quiz({
        title: `${course.category || 'Course'} Mastery Quiz`,
        course: course._id,
        passingScore: 70,
        questions: questionsToUse
      });

      await sampleQuiz.save();
      count++;
    }

    console.log(`Successfully added domain-specific quizzes to ${count} courses!`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAllQuizzes();
