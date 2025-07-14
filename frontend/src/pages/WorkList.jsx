import Heading from "../ui/Heading";
import Row from "../ui/Row";
import CreateNewExam from "../ui/CreateNewExam";
import ExamsTable from "../features/workList/ExamsTable";

function WorkList() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">WorkList</Heading>
        <CreateNewExam />
      </Row>

      <ExamsTable />
    </>
  );
}

export default WorkList;
