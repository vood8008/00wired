import shallow from "zustand/shallow";
import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import useStore from "../store/useStore";
import ApplicationNavbar from "../components/ApplicationNavbar";
import ApplicationSidebar from "../components/ApplicationSidebar";
import Chatbox from "../components/Chatbox";
import Dashboard from "../components/Dashboard";
import Spinner from "../components/Spinner";

export default function Application() {
  const [, setLocation] = useLocation();
  const { getUser, isLoading, user } = useStore(
    (state) => ({
      getUser: state.getUser,
      isLoading: state.isLoading,
      user: state.user,
    }),
    shallow
  );
  const initSocket = useStore((state) => state.initSocket);
  const [, params] = useRoute("/app/:ch");
  const decodedCh = decodeURI(params?.ch) || null;

  useEffect(() => {
    getUser()
      .then(() => initSocket())
      .catch((e) => setLocation("/login"));
  }, []);

  if (!isLoading && user) {
    return (
      <div className="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content ">
          {/* <!-- Page content here --> */}
          <ApplicationNavbar />
          {decodedCh === "dashboard" ? (
            <Dashboard />
          ) : (
            <Chatbox ch={decodedCh} />
          )}
        </div>
        <div className="drawer-side ">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          {/* <!-- Sidebar content here --> */}
          <ApplicationSidebar />
        </div>
      </div>
    );
  } else {
    return <Spinner />;
  }
}
