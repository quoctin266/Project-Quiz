import { useState, useEffect } from "react";
import Select from "react-select";
import Form from "react-bootstrap/Form";
import "./QuizQA.scss";
import FloatingLabel from "react-bootstrap/FloatingLabel";
// import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SiAddthis } from "react-icons/si";
import { FaMinusSquare } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import { Lightbox } from "react-modal-image";
import {
  getAllQuizAdmin,
  getQuizWithQA,
  postUpsertQA,
} from "../../../../services/APIService";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { isEnglish } from "../../../../utils/i18n";

const QuizQA = () => {
  let initQuestion = [
    {
      id: uuidv4(),
      description: "",
      imageFile: "",
      imageName: "",
      isInvalidQuestion: false,
      answers: [
        {
          id: uuidv4(),
          description: "",
          isInvalidAnswer: false,
          isCorrect: false,
        },
      ],
    },
  ]; //for generating question and answer input field

  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [listQuiz, setListQuiz] = useState([]);
  const [questions, setQuestions] = useState(initQuestion);
  const [previewImage, setPreviewImage] = useState("");

  const { t } = useTranslation();

  useEffect(() => {
    fetchQuiz();
  }, []); // get all quiz available when page load

  //converting base64 to file object
  function urltoFile(url, filename, mimeType) {
    return fetch(url)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], filename, { type: mimeType });
      });
  }

  useEffect(() => {
    const fetchQuizWithQA = async () => {
      let data = await getQuizWithQA(selectedQuiz.value);

      if (data && data.EC === 0) {
        let questionsClone = _.cloneDeep(data.DT.qa);
        for (let question of questionsClone) {
          question.isInvalidQuestion = false;

          if (question.imageFile) {
            question.imageName = `Question_${question.id}.png`;
            question.imageFile = await urltoFile(
              `data:image/png;base64,${question.imageFile}`,
              `Question_${question.id}.png`,
              "image/png"
            );
          }

          for (let answer of question.answers) {
            answer.isInvalidAnswer = false;
          }
        }
        setQuestions(questionsClone);
      }
    };

    if (selectedQuiz) {
      fetchQuizWithQA();
    }
  }, [selectedQuiz]);

  const fetchQuiz = async () => {
    let data = await getAllQuizAdmin();
    if (data?.DT) {
      let newListQuiz = data.DT.toSorted((a, b) => a.id - b.id);
      newListQuiz = newListQuiz.map((quiz, index) => {
        return {
          value: quiz.id,
          label: `${index + 1} - ${quiz.name}`,
        };
      });
      setListQuiz(newListQuiz);
    }
  };

  const handleAddQuestion = () => {
    let question = {
      id: uuidv4(),
      description: "",
      imageFile: "",
      imageName: "",
      isInvalidQuestion: false,
      answers: [
        {
          id: uuidv4(),
          description: "",
          isInvalidAnswer: false,
          isCorrect: false,
        },
      ],
    }; // generating an empty input field for filling in info
    let questionsClone = [...questions, question];
    setQuestions(questionsClone);
  };

  const handleDeleteQuestion = (id) => {
    let questionsClone = _.cloneDeep(questions);
    questionsClone = questionsClone.filter((item) => item.id !== id);
    setQuestions(questionsClone);
  };

  const handleAddAnswer = (questionId) => {
    let questionsClone = _.cloneDeep(questions);
    let answer = {
      id: uuidv4(),
      description: "",
      isInvalidAnswer: false,
      isCorrect: false,
    }; // generating an empty input field for filling in info
    let index = questionsClone.findIndex((item) => item.id === questionId);
    if (index > -1) {
      questionsClone[index].answers.push(answer);
      setQuestions(questionsClone);
    }
  };

  const handleDeleteAnswer = (questionId, answerId) => {
    let questionsClone = _.cloneDeep(questions);
    let index = questionsClone.findIndex((item) => item.id === questionId);
    if (index > -1) {
      questionsClone[index].answers = questionsClone[index].answers.filter(
        (item) => item.id !== answerId
      );
      setQuestions(questionsClone);
    }
  };

  //let react handle question input value
  const handleChangeQuestion = (questionId, value) => {
    let questionsClone = _.cloneDeep(questions);
    let index = questionsClone.findIndex((item) => item.id === questionId);
    if (index > -1) {
      questionsClone[index].description = value;
      if (questionsClone[index].description)
        questionsClone[index].isInvalidQuestion = false; //if input field is no longer empty, stop displaying warning
      setQuestions(questionsClone);
    }
  };

  //let react handle image input value
  const handleOnchangeImage = (event, questionId) => {
    let questionsClone = _.cloneDeep(questions);
    let index = questionsClone.findIndex((item) => item.id === questionId);
    if (index > -1 && event?.target?.files) {
      if (event.target.files.length > 0) {
        questionsClone[index].imageFile = event.target.files[0];
        questionsClone[index].imageName = event.target.files[0].name;
        setQuestions(questionsClone);
      }
    }
  };

  //let react handle answer input value and checkbox value
  const handleOnChangeAnswer = (type, event, questionId, answerId) => {
    let questionsClone = _.cloneDeep(questions);
    let index = questionsClone.findIndex((item) => item.id === questionId);
    if (index > -1) {
      questionsClone[index].answers = questionsClone[index].answers.map(
        (answer) => {
          if (answer.id === answerId) {
            if (type === "checkbox") {
              answer.isCorrect = event.target.checked;
            }
            if (type === "text") {
              answer.description = event.target.value;
              if (answer.description) answer.isInvalidAnswer = false;
            }
          }
          return answer;
        }
      );
      setQuestions(questionsClone);
    }
  };

  //let react handle preview image value
  const handlePreviewImage = (questionId) => {
    let questionsClone = _.cloneDeep(questions);
    let index = questionsClone.findIndex((item) => item.id === questionId);
    if (index > -1) {
      setPreviewImage({
        url: URL.createObjectURL(questionsClone[index].imageFile),
        imageName: questionsClone[index].imageName,
      });
    }
  };

  // clear image input value
  const handleClearImage = (questionId) => {
    let questionsClone = _.cloneDeep(questions);
    let index = questionsClone.findIndex((item) => item.id === questionId);
    if (index > -1) {
      questionsClone[index].imageFile = "";
      questionsClone[index].imageName = "";
      document.getElementById(`file-input-${questionId}`).value = null;
      setQuestions(questionsClone);
    }
  };

  const handleSaveButton = async () => {
    let questionsClone = _.cloneDeep(questions);

    if (_.isEmpty(selectedQuiz)) {
      toast.error("Please choose a quiz!");
      return;
    }

    let validQuestion = questionsClone.every((question, index) => {
      if (!question.description) {
        toast.error(`Question ${index + 1}: Empty question.`);
        question.isInvalidQuestion = true;
        setQuestions(questionsClone);
        return false;
      } else return true;
    }); //validate empty question

    if (!validQuestion) return;

    let validQuestionAndAnswers = questionsClone.every((question, qIndex) => {
      let validAnswer = question.answers.every((answer, aIndex) => {
        if (!answer.description) {
          toast.error(`Question ${qIndex + 1} contains empty answer(s).`);
          answer.isInvalidAnswer = true;
          setQuestions(questionsClone);
          return false;
        } else return true;
      });
      if (!validAnswer) return false;
      else return true;
    }); //validate empty answers

    if (!validQuestionAndAnswers) return;

    let validCheckbox = questionsClone.every((question, index) => {
      let correctAnswer = question.answers.filter(
        (answer) => answer.isCorrect === true
      );

      if (correctAnswer.length === 0) {
        toast.error(`Question ${index + 1}: Please assign a correct answer.`);
        return false;
      }

      if (correctAnswer.length > 1) {
        toast.error(`Question ${index + 1}: Only one correct answer allowed.`);
        return false;
      }

      return true;
    }); //validate checkbox, only one checkbox can be checked

    if (!validCheckbox) return;

    //converting file object to base64
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

    for (let question of questionsClone) {
      delete question.isInvalidQuestion;
      if (question.imageFile) {
        question.imageFile = await toBase64(question.imageFile);
      }

      for (let answer of question.answers) {
        delete answer.isInvalidAnswer;
      }
    } // prepare data format for API

    let data = await postUpsertQA({
      quizId: selectedQuiz.value,
      questions: questionsClone,
    });

    if (data && data.EC === 0) {
      toast.success(data.EM);
    } else toast.error(data.EM);
  };

  return (
    <div className="manage-qa-container">
      <div className="add-new">
        <div className="select-quiz">
          <div className="select-quiz-header">
            {t("admin.updateQuizQA.select")}
          </div>
          <Select
            defaultValue={selectedQuiz}
            value={selectedQuiz}
            onChange={setSelectedQuiz}
            options={listQuiz}
            placeholder={t("admin.updateQuizQA.selectPlaceholder")}
            className="mt-2"
          />
        </div>
        {questions && questions.length > 0 && (
          <div className="add-question-header">
            {t("admin.updateQuizQA.addQuestion")}
          </div>
        )}
        <div className="add-question-body">
          {questions &&
            questions.length > 0 &&
            questions.map((question, index) => {
              return (
                <div className="add-question-content" key={question.id}>
                  <div className="add-new-question">
                    <Row>
                      <Form.Group
                        as={Col}
                        controlId="formGridQuestion"
                        className="col-5 mt-1"
                      >
                        <Form.Label></Form.Label>
                        <FloatingLabel
                          controlId="floatingDescription"
                          label={
                            isEnglish()
                              ? `Question ${index + 1}'s Description`
                              : `Nội dung câu hỏi ${index + 1}`
                          }
                        >
                          <Form.Control
                            isInvalid={question.isInvalidQuestion}
                            type="text"
                            value={question.description}
                            onChange={(e) =>
                              handleChangeQuestion(question.id, e.target.value)
                            }
                          />
                        </FloatingLabel>
                      </Form.Group>

                      <Form.Group as={Col} className="col-3">
                        <Form.Label className="w-100">
                          <span>{t("admin.updateQuizQA.imageLabel")}</span>
                          {
                            // display view image option if there is image
                            question.imageFile && (
                              <span
                                className="view-image"
                                onClick={() => handlePreviewImage(question.id)}
                              >
                                {t("admin.updateQuizQA.viewImage")} <FaImage />
                              </span>
                            )
                          }
                        </Form.Label>
                        <Form.Control
                          type="file"
                          onChange={(event) =>
                            handleOnchangeImage(event, question.id)
                          }
                          id={`file-input-${question.id}`}
                          className="mt-2"
                        />
                      </Form.Group>

                      <Form.Group as={Col}>
                        <div className="btn-group">
                          <span
                            className="clear-image-btn"
                            onClick={() => handleClearImage(question.id)}
                          >
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id="tooltip-top">
                                  {t("admin.updateQuizQA.clearImage")}
                                </Tooltip>
                              }
                            >
                              <span>
                                <AiOutlineDelete />
                              </span>
                            </OverlayTrigger>
                          </span>
                          <span
                            className="add-icon"
                            onClick={handleAddQuestion}
                          >
                            <SiAddthis />
                          </span>
                          {
                            // display delete option only if there is more than 1 question
                            questions && questions.length > 1 && (
                              <span
                                className="remove-icon"
                                onClick={() =>
                                  handleDeleteQuestion(question.id)
                                }
                              >
                                <FaMinusSquare />
                              </span>
                            )
                          }
                        </div>
                      </Form.Group>
                    </Row>
                  </div>
                  {
                    // display answers for each question
                    question.answers &&
                      question.answers.length > 0 &&
                      question.answers.map((answer, index) => {
                        return (
                          <div className="add-new-answer" key={answer.id}>
                            <Row>
                              <Form.Group
                                className="checkbox-container col-1"
                                as={Col}
                              >
                                <Form.Check
                                  type="checkbox"
                                  checked={answer.isCorrect}
                                  onChange={(event) => {
                                    handleOnChangeAnswer(
                                      "checkbox",
                                      event,
                                      question.id,
                                      answer.id
                                    );
                                  }}
                                />
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                controlId="formGridAnswer"
                                className="col-5"
                              >
                                <FloatingLabel
                                  controlId="floatingAnswer1"
                                  label={
                                    isEnglish()
                                      ? `Answer ${index + 1}`
                                      : `Đáp án ${index + 1}`
                                  }
                                >
                                  <Form.Control
                                    isInvalid={answer.isInvalidAnswer}
                                    type="text"
                                    value={answer.description}
                                    onChange={(event) => {
                                      handleOnChangeAnswer(
                                        "text",
                                        event,
                                        question.id,
                                        answer.id
                                      );
                                    }}
                                  />
                                </FloatingLabel>
                              </Form.Group>

                              <Form.Group as={Col}>
                                <div className="btn-group">
                                  <span
                                    className="add-icon"
                                    onClick={() => handleAddAnswer(question.id)}
                                  >
                                    <SiAddthis />
                                  </span>
                                  {
                                    // display delete option only if there is more than 1 answer
                                    question.answers &&
                                      question.answers.length > 1 && (
                                        <span
                                          className="remove-icon"
                                          onClick={() =>
                                            handleDeleteAnswer(
                                              question.id,
                                              answer.id
                                            )
                                          }
                                        >
                                          <FaMinusSquare />
                                        </span>
                                      )
                                  }
                                </div>
                              </Form.Group>
                            </Row>
                          </div>
                        );
                      })
                  }
                </div>
              );
            })}
          {
            // display save button only if there is at least 1 question
            questions && questions.length > 0 && (
              <div className="save-btn">
                <Button variant="primary" onClick={handleSaveButton}>
                  {t("admin.updateQuizQA.saveButton")}
                </Button>
              </div>
            )
          }
          {questions && questions.length === 0 && (
            <div className="mt-3">{t("admin.updateQuizQA.emptyQuiz")}</div>
          )}
        </div>
        {
          //after setting preview image, display it
          previewImage && (
            <Lightbox
              medium={previewImage.url}
              alt={previewImage.imageName}
              hideDownload
              hideZoom
              onClose={() => setPreviewImage("")}
            />
          )
        }
      </div>
    </div>
  );
};

export default QuizQA;
