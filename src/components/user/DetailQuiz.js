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

const DetailQuiz = () => {
  const location = useLocation();
  const params = useParams();
  const quizId = params.id;

  const [dataQuiz, setDataQuiz] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); //current question pointer

  const [showModal, setShowModal] = useState(false);
  const [dataModal, setDataModal] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      let data = await getDataQuiz(quizId);
      if (data?.DT) {
        let rawData = [...data.DT];

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
          userAnswerId: [], //array containing all chosen answer id
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
      } else toast.error(data.EM);
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

  return (
    <div className="detail-quiz-container">
      <div className="left-content">
        <div className="title">
          Quiz {quizId}: {location?.state?.quizTitle}
        </div>
        <hr />
        <div className="question-container">
          <Question
            data={dataQuiz && dataQuiz.length > 0 ? dataQuiz[currentIndex] : {}}
            index={currentIndex}
            handleSelectAnswer={handleSelectAnswer}
          />
        </div>
        <div className="footer">
          <Button variant="secondary" onClick={handlePrev}>
            Prev
          </Button>
          <Button variant="primary" onClick={handleNext}>
            Next
          </Button>
          <Button variant="warning" onClick={handleFinish}>
            Finish
          </Button>
        </div>
      </div>
      <div className="right-content">
        <QuizSidebar
          dataQuiz={dataQuiz}
          handleFinish={handleFinish}
          setCurrentIndex={setCurrentIndex}
          currentIndex={currentIndex}
        />
      </div>
      <ModalResult
        showModal={showModal}
        setShowModal={setShowModal}
        dataModal={dataModal}
      />
    </div>
  );
};

export default DetailQuiz;
