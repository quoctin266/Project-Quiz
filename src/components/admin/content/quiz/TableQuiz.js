import Table from "react-bootstrap/Table";
import ModalFormUpdateQuiz from "./ModalFormUpdateQuiz";
import ModalFormDeleteQuiz from "./ModalFormDeleteQuiz";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { isEnglish } from "../../../../utils/i18n";

const TableQuiz = (props) => {
  const { listQuiz } = props;
  const { t } = useTranslation();

  let cloneListQuiz = _.cloneDeep(listQuiz);
  cloneListQuiz.forEach((quiz) => {
    switch (quiz.difficulty) {
      case "EASY":
        quiz.difficulty = isEnglish() ? "EASY" : "DỄ";
        break;
      case "MEDIUM":
        quiz.difficulty = isEnglish() ? "MEDIUM" : "VỪA";
        break;
      case "HARD":
        quiz.difficulty = isEnglish() ? "HARD" : "KHÓ";
        break;
      default:
        return;
    }
  });

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>{t("admin.manageQuiz.quizTable.number")}</th>
          <th>{t("admin.manageQuiz.quizTable.name")}</th>
          <th>{t("admin.manageQuiz.quizTable.description")}</th>
          <th>{t("admin.manageQuiz.quizTable.type")}</th>
          <th>{t("admin.manageQuiz.quizTable.buttonGroup")}</th>
        </tr>
      </thead>
      <tbody>
        {cloneListQuiz &&
          cloneListQuiz.length > 0 &&
          cloneListQuiz.map((item, index) => {
            return (
              <tr key={item.id} style={{ lineHeight: "2.2em" }}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td style={{ minWidth: "100px" }}>{item.difficulty}</td>
                <td style={{ display: "flex", gap: "5%" }}>
                  <ModalFormUpdateQuiz
                    item={item}
                    fetchQuiz={props.fetchQuiz}
                  />
                  <ModalFormDeleteQuiz
                    item={item}
                    fetchQuiz={props.fetchQuiz}
                  />
                </td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
};

export default TableQuiz;
