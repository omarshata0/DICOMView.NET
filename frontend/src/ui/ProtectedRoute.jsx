import Spinner from "./Spinner";
// import { useNavigate } from "react-router-dom";
// import PropTypes from "prop-types";

function ProtectedRoute({ children }) {
  // const navigate = useNavigate();

  // 1. Load the authenticated user
  // const { isLoading, isAuthenticated } = useUser();

  // 2. If there is NO authenticated user, redirect to the /login
  // useEffect(
  //   function () {
  //     if (!isAuthenticated && !isLoading) navigate("/login");
  //   },
  //   [isAuthenticated, isLoading, navigate]
  // );

  // 3. While loading, show a spinner
  // if (isLoading)
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <Spinner />
  //     </div>
  //   );

  // 4. If there IS a user, render the app
  // if (isAuthenticated) return children;
  return children;
}

// ProtectedRoute.propTypes = {
//   children: PropTypes.node.isRequired,
// };

export default ProtectedRoute;
