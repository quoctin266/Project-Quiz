import CountDown from "./CountDown";

const QuizSidebar = (props) => {
  const { dataQuiz, handleFinish, setCurrentIndex, currentIndex } = props;

  const onTimesUp = () => {
    handleFinish();
  };

  const generateClassName = (question, index) => {
    let isNotAnswered = question.answers.every(
      (answer) => answer.isSelected === false
    ); // check if the question has all answers not selected

    if (currentIndex === index && !isNotAnswered)
      return "question answered current"; //  Styling CURRENT display question that HAS BEEN answered
    if (currentIndex === index && isNotAnswered) return "question current"; //  Styling CURRENT display question that HAS NOT BEEN answered
    if (currentIndex !== index && !isNotAnswered) return "question answered"; //  Styling questions NOT on display that HAS BEEN answered
    return "question"; //  Styling questions NOT on display that HAS NOT BEEN answered
  };

  const handleClickQuestion = (index) => {
    setCurrentIndex(index);
  };

  return (
    <>
      <div className="timer">
        <CountDown onTimesUp={onTimesUp} />
      </div>
      <div className="list-question">
        {dataQuiz &&
          dataQuiz.length > 0 &&
          dataQuiz.map((question, index) => {
            return (
              <div
                id={`question-${question.questionId}`}
                className={generateClassName(question, index)}
                key={question.questionId}
                onClick={() => handleClickQuestion(index, question)}
              >
                <input type="hidden" />
                {index + 1}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default QuizSidebar;
