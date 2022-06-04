import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

const CustomAlert = ({
  alertMessage,
  show,
  setShow,
  variant,
  forLogin = false,
}) => {
  console.log("@Alerts.js");
  return (
    <>
      {show && (
        <Alert
          key={1}
          variant={variant}
          onClose={() => setShow(false)}
          dismissible
        >
          {alertMessage}
          {forLogin && (
            <>
              <hr />
              <div className="d-flex justify-content-end">
                <Link to="/login">
                  <Button
                    onClick={() => setShow(false)}
                    variant="outline-success"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </>
          )}
        </Alert>
      )}
    </>
  );
};

export default CustomAlert;
