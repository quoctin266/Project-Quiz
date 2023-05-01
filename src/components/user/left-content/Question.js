import _ from "lodash";
import Form from "react-bootstrap/Form";
import { Lightbox } from "react-modal-image";
import { useState } from "react";
import "./Question.scss";
import { useTranslation } from "react-i18next";
import { RxCross2 } from "react-icons/rx";
import { FcCheckmark } from "react-icons/fc";

const Question = (props) => {
  const { data, index, submitted } = props;
  const [previewImage, setPreviewImage] = useState("");

  const { t } = useTranslation();

  if (_.isEmpty(data)) {
    return <></>;
  }

  const handlePreviewImage = () => {
    setPreviewImage(`data:image/jpeg;base64,${data.questionImg}`);
  };

  return (
    <>
      <div className="question">
        <div className="question-img">
          {data?.questionImg ? (
            <img
              src={`data:image/jpeg;base64,${data.questionImg}`}
              alt=""
              onClick={handlePreviewImage}
            />
          ) : (
            <div></div>
          )}
        </div>
        <div className="question-title">
          {t("users.quiz.body.question")} {index + 1}: {data.questionDes} ?
        </div>
      </div>
      <div className="answers">
        <Form>
          {data.answers &&
            data.answers.length > 0 &&
            data.answers.map((item) => {
              return (
                <div key={item.id} className="answer">
                  <Form.Check
                    label={item.description}
                    name="group1"
                    type="radio"
                    id={`default-radio-${item.id}`}
                    onChange={() => props.handleSelectAnswer(item.id)}
                    checked={item.isSelected}
                    disabled={submitted} // disable choosing when viewing answers
                  />

                  {/* displaying check or cross according to correct or wrong answer */}
                  {item.isCorrect && <FcCheckmark />}
                  {item.isSelected && item.isCorrect === false && (
                    <RxCross2 style={{ color: "red" }} />
                  )}
                </div>
              );
            })}
        </Form>
        {
          //after setting preview image, display it on click
          previewImage && (
            <Lightbox
              medium={previewImage}
              alt="question_img"
              hideDownload
              hideZoom
              onClose={() => setPreviewImage("")}
            />
          )
        }
      </div>
    </>
  );
};

export default Question;
