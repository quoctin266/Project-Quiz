import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { getQuizByUser } from "../../services/APIService";
import "./ListQuiz.scss";
import { useNavigate } from "react-router-dom";

const ListQuiz = () => {
  const [quizArr, setQuizArr] = useState([]);
  const navigate = useNavigate();

  const getQuizData = async () => {
    let data = await getQuizByUser();
    if (data?.DT) {
      const listQuiz = data.DT.toSorted((a, b) => a.id - b.id);
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
                        state: { quizTitle: item.description },
                      });
                    }}
                  >
                    Start now
                  </Button>
                </Card.Body>
              </Card>
            </div>
          );
        })}
      {quizArr && quizArr.length === 0 && (
        <div>No Quiz available currently...</div>
      )}
    </div>
  );
};

export default ListQuiz;
