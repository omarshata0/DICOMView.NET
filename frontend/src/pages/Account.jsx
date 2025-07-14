import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { useUser } from "../features/authentication/useUser";

function Account() {
  const { isLoading, user } = useUser();

  if (isLoading) {
    return (
      <>
        <Heading as="h1">Update your account</Heading>
        <Row>
          <Heading as="h3">Loading user data...</Heading>
        </Row>
      </>
    );
  }

  return (
    <div className="px-10 py-5 flex flex-col ">
      <Heading as="h1">User data</Heading>

      <div className="flex flex-col gap-5 pt-10">
        <p className="text-4xl font-bold">User ID: {user?.userId || "N/A"}</p>
        <p className="text-4xl font-bold">
          Username: {user?.username || "N/A"}
        </p>
        <p className="text-4xl font-bold">Email: {user?.email || "N/A"}</p>
      </div>
    </div>
  );
}

export default Account;
