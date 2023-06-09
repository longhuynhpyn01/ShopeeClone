import { useContext, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AppContext } from "./contexts/app.context";
import useRouteElements from "./useRouteElements";
import { LocalStorageEventTarget } from "./utils/auth";

function App() {
  const routeElements = useRouteElements();
  const { reset } = useContext(AppContext);

  useEffect(() => {
    // Lắng nghe event clearLS từ src/utils/auth.ts để reset state localstorage khi access_token hết hạn
    LocalStorageEventTarget.addEventListener("clearLS", reset);

    return () => {
      LocalStorageEventTarget.removeEventListener("clearLS", reset);
    };
  }, [reset]);

  return (
    <div>
      {routeElements}
      <ToastContainer />
    </div>
  );
}

export default App;
