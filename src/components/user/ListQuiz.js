import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { getQuizByUser } from "../../services/APIService";
import "./ListQuiz.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ListQuiz = () => {
  const [quizArr, setQuizArr] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // fetch data on page load
  const getQuizData = async () => {
    let data = await getQuizByUser();
    if (data?.DT) {
      const listQuiz = data.DT.toSorted((a, b) => a.id - b.id); // sort quiz ascending to id
      setQuizArr(listQuiz);
    }
  };

  useEffect(() => {
    getQuizData();
  }, []);

  return (
    <div className="list-quiz-container container">
      {quizArr &&
        quizArr.length > 0 &&
        quizArr.map((item, index) => {
          return (
            <div className="quiz-container" key={item.id}>
              <Card style={{ width: "18rem" }}>
                <Card.Img
                  variant="top"
                  src={`data:image/jpeg;base64,${item.image}`}
                />
                <Card.Body>
                  <Card.Title>Quiz {index + 1}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => {
                      navigate(`/quiz/${item.id}`, {
                        state: { quizTitle: item.description }, // send quiz title along when navigate to quiz detail page
                      });
                    }}
                  >
                    {t("users.startButton")}
                  </Button>
                </Card.Body>
              </Card>
            </div>
          );
        })}
      {quizArr && quizArr.length === 0 && (
        <div style={{ fontSize: "1.3em" }}>{t("users.noQuizMessage")}</div>
      )}
    </div>
  );
};

export default ListQuiz;
