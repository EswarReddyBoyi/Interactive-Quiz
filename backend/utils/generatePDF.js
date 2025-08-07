const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDF = (user, quiz, resultDetails, userAnswers = []) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '..', 'temp', `scorecard-${quiz.testID}-${Date.now()}.pdf`);
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(18).text('Interactive Quiz Scorecard', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Test Name: ${quiz.testName}`);
    doc.text(`Test ID: ${quiz.testID}`);
    doc.text(`Date: ${new Date().toLocaleString()}`);
    doc.text(`Score: ${resultDetails.score} / ${resultDetails.total}`);
    doc.moveDown();

    quiz.questions.forEach((q, i) => {
      doc.font('Helvetica-Bold').text(`Q${i + 1}: ${q.questionText}`);
      doc.font('Helvetica').text(`Correct Answer: ${q.correctAnswer}`);
      doc.font('Helvetica-Oblique').text(`Your Answer: ${userAnswers[i] || 'Not answered'}`);
      doc.moveDown();
    });

    doc.end();

    doc.on('finish', () => resolve(filePath));
    doc.on('error', reject);
  });
};

module.exports = generatePDF;
