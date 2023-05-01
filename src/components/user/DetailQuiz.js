import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDataQuiz, postSubmitQuiz } from "../../services/APIService";
import _ from "lodash";
import "./DetailQuiz.scss";
import Button from "react-bootstrap/Button";
import Question from "./left-content/Question";
import ModalResult from "./left-content/ModalResult";
import { toast } from "react-toastify";
import QuizSidebar from "./right-content/QuizSidebar";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DetailQuiz = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const quizId = params.id;

  const [dataQuiz, setDataQuiz] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); //current question pointer

  const [showModal, setShowModal] = useState(false);
  const [dataModal, setDataModal] = useState({});

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      let data = await getDataQuiz(quizId);
      if (data?.DT) {
        let rawData = [...data.DT];

        // refine data structure before giving to react state
        let newData = _.chain(rawData)
          // Group the elements of Array based on `id` property
          .groupBy("id")
          // `key` is group's name (id), `value` is the array of objects
          .map((value, key) => {
            let tempObj = { questionDes: "", questionImg: "", answers: [] };
            value.forEach((item, index) => {
              item.answers = { ...item.answers, isSelected: false };
              if (index === 0) {
                tempObj.questionDes = item.description;
                tempObj.questionImg = item.image;
              }
              tempObj.answers.push(item.answers);
            }); //create objects that represent each question
            tempObj.answers = _.orderBy(tempObj.answers, ["id"], ["asc"]);
            return { questionId: key, ...tempObj };
          })
          .value();
        setDataQuiz(newData);
      }
    };

    fetchQuestions();
  }, [quizId]);

  const handlePrev = () => {
    if (currentIndex === 0) return; //if there's no previous question do nothing
    setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex === dataQuiz.length - 1)
      setCurrentIndex(0); //If last question, return to the beginning
    else setCurrentIndex(currentIndex + 1);
  };

  const handleFinish = async () => {
    if (dataQuiz && dataQuiz.length > 0) {
      //config data according to API
      let submitData = {
        quizId: +quizId,
        answers: [],
      };
      dataQuiz.forEach((question) => {
        let result = {
          questionId: +question.questionId,
          userAnswerId: [], //array containing chosen answer id in each question
        };

        question.answers.forEach((answer) => {
          if (answer.isSelected) result.userAnswerId.push(answer.id);
        });

        submitData.answers.push(result);
      });
      let data = await postSubmitQuiz(submitData);
      if (data?.DT) {
        setDataModal({ ...data.DT });
        setShowModal(true);
        setSubmitted(true);
      } else toast.error(`${t("users.notification.errorSubmit")}`);
    }
  };

  const handleSelectAnswer = (answerId) => {
    let currentQuestion = { ...dataQuiz[currentIndex] };
    currentQuestion.answers = currentQuestion.answers.map((item) => {
      if (item.id === answerId) {
        item.isSelected = true;
      } else item.isSelected = false;
      return item;
    }); //find the answer chosen and mark it, unmark other answers

    let dataQuizCopy = [...dataQuiz];
    dataQuizCopy[currentIndex] = currentQuestion;
    setDataQuiz(dataQuizCopy);
  };

  const handleShowAnswers = () => {
    let userSubmitData = dataModal.quizData;
    let resultData = _.cloneDeep(dataQuiz);

    //  comparing between original data and data from user submit, mark user selection and the correct answer for displaying
    resultData.forEach((question, qIndex) => {
      question.answers.forEach((answer) => {
        // finding user selection and mark it
        if (answer.id === userSubmitData[qIndex].userAnswers[0])
          answer.isSelected = true;

        // finding and marking the correct answer
        if (answer.id === userSubmitData[qIndex].systemAnswers[0].id)
          answer.isCorrect = true;
        else answer.isCorrect = false;
      });
    });
    setDataQuiz(resultData);
  };

  return (
    <>
      <Breadcrumb className="breadcrumb-bar">
        <Breadcrumb.Item onClick={() => navigate("/")}>
          {t("users.quiz.header.homeNavigate")}
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate("/user")}>
          {t("users.quiz.header.userNavigate")}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          {t("users.quiz.header.currentQuiz")}
        </Breadcrumb.Item>
      </Breadcrumb>

      <div className="detail-quiz-container">
        <div className="left-content">
          <div className="title">
            Quiz {quizId}: {location?.state?.quizTitle}{" "}
            {/* retrieve quiz title from list quiz page navigation */}
          </div>
          <hr />
          <div className="question-container">
            {/* passing current question infomation */}
            <Question
              data={
                dataQuiz && dataQuiz.length > 0 ? dataQuiz[currentIndex] : {}
              }
              index={currentIndex}
              handleSelectAnswer={handleSelectAnswer}
              submitted={submitted}
            />
          </div>
          <div className="footer">
            <Button variant="secondary" onClick={handlePrev}>
              {t("users.quiz.buttonGroup.previousButton")}
            </Button>
            <Button variant="primary" onClick={handleNext}>
              {t("users.quiz.buttonGroup.nextButton")}
            </Button>
            {!submitted ? (
              <Button variant="warning" onClick={handleFinish}>
                {t("users.quiz.buttonGroup.finishButton")}
              </Button>
            ) : (
              <Button variant="warning" onClick={() => navigate("/user")}>
                {t("users.quiz.buttonGroup.doneButton")}
              </Button>
            )}
          </div>
        </div>
        <div className="right-content">
          <QuizSidebar
            dataQuiz={dataQuiz}
            handleFinish={handleFinish}
            setCurrentIndex={setCurrentIndex}
            currentIndex={currentIndex}
            submitted={submitted}
          />
        </div>
        <ModalResult
          showModal={showModal}
          setShowModal={setShowModal}
          dataModal={dataModal}
          handleShowAnswers={handleShowAnswers}
        />
      </div>
    </>
  );
};

export default DetailQuiz;
