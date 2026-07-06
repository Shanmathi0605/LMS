import { jsPDF } from 'jspdf';

export const generateCertificate = (studentName, courseTitle) => {
  // Create a new PDF document (landscape mode, A4)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4'
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // Draw border / background
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(0, 0, width, height, 'F');
  
  // Draw an inner border
  doc.setDrawColor(79, 70, 229); // indigo-600
  doc.setLineWidth(10);
  doc.rect(20, 20, width - 40, height - 40, 'S');

  // Add decorative corners
  doc.setFillColor(139, 92, 246); // violet-500
  doc.triangle(20, 20, 100, 20, 20, 100, 'F'); // Top Left
  doc.triangle(width - 20, 20, width - 100, 20, width - 20, 100, 'F'); // Top Right
  doc.triangle(20, height - 20, 100, height - 20, 20, height - 100, 'F'); // Bottom Left
  doc.triangle(width - 20, height - 20, width - 100, height - 20, width - 20, height - 100, 'F'); // Bottom Right

  // Certificate Header
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59); // slate-800
  doc.setFontSize(40);
  doc.text('CERTIFICATE OF COMPLETION', width / 2, 120, { align: 'center' });

  // Subheader
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('THIS IS PROUDLY PRESENTED TO', width / 2, 170, { align: 'center' });

  // Student Name
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(48);
  doc.setTextColor(79, 70, 229); // indigo-600
  doc.text(studentName.toUpperCase(), width / 2, 250, { align: 'center' });

  // Divider Line
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(2);
  doc.line(width / 2 - 200, 270, width / 2 + 200, 270);

  // Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('For successfully completing the comprehensive course:', width / 2, 320, { align: 'center' });

  // Course Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(courseTitle, width / 2, 370, { align: 'center' });

  // Date and Signature Block
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105); // slate-600
  
  // Date Left
  doc.text(today, 150, 480);
  doc.setLineWidth(1);
  doc.line(120, 490, 280, 490);
  doc.text('Date of Completion', 200, 510, { align: 'center' });

  // Signature Right
  doc.setFont('cursive', 'italic');
  doc.setFontSize(24);
  doc.text('SkillNova', width - 200, 475, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setLineWidth(1);
  doc.line(width - 280, 490, width - 120, 490);
  doc.text('SkillNova Director', width - 200, 510, { align: 'center' });

  // Save the PDF
  doc.save(`${courseTitle.replace(/\s+/g, '_')}_Certificate.pdf`);
};
