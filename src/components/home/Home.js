import homeVideo from "../../assets/video/video-1920.mp4";
import Button from "react-bootstrap/Button";
import "./Home.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Home = () => {
  const isAuthenticated = useSelector(
    (state) => state.userAccount.isAuthenticated
  );

  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="banner-container">
      <video autoPlay muted loop>
        <source src={homeVideo} type="video/mp4" />
      </video>
      <div className="banner-info">
        <div className="banner-title">{t("home.bannerTitle")}</div>
        <div className="banner-description">{t("home.bannerDescription")}</div>
        <div className="banner-btn">
          {isAuthenticated ? (
            <Button
              variant="dark"
              onClick={() => {
                navigate("/user");
              }}
            >
              {t("home.buttonStartQuiz")}
            </Button>
          ) : (
            <Button
              variant="dark"
              onClick={() => {
                navigate("/register");
              }}
            >
              {t("home.buttonSignup")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
