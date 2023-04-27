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
        <div className="banner-description">
          You don't want to make a boring form. And your audience won't answer
          one. Create a typeform instead—and make everyone happy.
        </div>
        <div className="banner-btn">
          {isAuthenticated ? (
            <Button
              variant="dark"
              onClick={() => {
                navigate("/user");
              }}
            >
              Start your quiz now
            </Button>
          ) : (
            <Button
              variant="dark"
              onClick={() => {
                navigate("/register");
              }}
            >
              Get started - it's free
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
