import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import "./NotFound.scss";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="not-found-container">
      <Alert variant="secondary" className="alert-message">
        <div>
          <div className="text1">{t("notFound.title")}</div>
          <div className="text2">{t("notFound.content")}</div>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            navigate("/");
          }}
        >
          {t("notFound.homeNavigate")}
        </Button>
      </Alert>
    </div>
  );
};

export default NotFound;
