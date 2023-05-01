import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import "./LimitedAccess.scss";
import { useTranslation } from "react-i18next";

const LimitedAccess = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="limited-access-container">
      <Alert variant="secondary" className="alert-message">
        <div>
          <div className="text1">{t("limitedAccess.title")}</div>
          <div className="text2">{t("limitedAccess.message1")}</div>
          <div className="text3">{t("limitedAccess.message2")}</div>
        </div>
        <Button
          variant="success"
          onClick={() => {
            navigate("/");
          }}
        >
          {t("limitedAccess.homeNavigate")}
        </Button>
      </Alert>
    </div>
  );
};

export default LimitedAccess;
