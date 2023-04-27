import _ from "lodash";
import Form from "react-bootstrap/Form";
import { Lightbox } from "react-modal-image";
import { useState } from "react";
import "./Question.scss";

const Question = (props) => {
  const { data, index } = props;
  const [previewImage, setPreviewImage] = useState("");

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
          Question {index + 1}: {data.questionDes} ?
        </div>
      </div>
      <div className="answers">
        <Form>
          {data.answers &&
            data.answers.length > 0 &&
            data.answers.map((item, index) => {
              return (
                <Form.Check
                  label={item.description}
                  name="group1"
                  type="radio"
                  key={item.id}
                  id={`default-radio-${item.id}`}
                  onChange={() => props.handleSelectAnswer(item.id)}
                  checked={item.isSelected}
                />
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
