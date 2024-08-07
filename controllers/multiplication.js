const generateMultiplicationQuestions = (numQuestions) => {
  const questions = [];

  for (let i = 0; i < numQuestions; i++) {
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 1;

    questions.push({
      question_id: i + 1,
      num1,
      num2,
    });
  }

  return questions;
};

module.exports = {
  generateMultiplicationQuestions,
};
