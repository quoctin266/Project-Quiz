import NavDropdown from "react-bootstrap/NavDropdown";
import { useTranslation } from "react-i18next";
import { isEnglish } from "../../utils/i18n";

const Language = () => {
  const { i18n } = useTranslation();

  const handleChangeLng = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <NavDropdown
        title={isEnglish() ? "English" : "Việt Nam"}
        id="collasible-nav-dropdown"
        className="language"
      >
        <NavDropdown.Item onClick={() => handleChangeLng("en")}>
          English
        </NavDropdown.Item>
        <NavDropdown.Item onClick={() => handleChangeLng("vi")}>
          Việt Nam
        </NavDropdown.Item>
      </NavDropdown>
    </>
  );
};

export default Language;
