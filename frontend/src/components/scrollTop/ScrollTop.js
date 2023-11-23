// https://stackoverflow.com/questions/36904185/react-router-scroll-to-top-on-every-transition
import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

export default function ScrollTop() {
  const { pathname } = useLocation();
  const [searchparams] = useSearchParams();

  useEffect(() => {
    document.querySelector(".content").scrollTo(0, 0);
  }, [pathname, searchparams]);

  return null;
}
