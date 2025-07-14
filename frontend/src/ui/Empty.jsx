function Empty({ resourceName }) {
  return (
    <p className="flex items-center justify-center text-3xl font-bold">
      No {resourceName} could be found!
    </p>
  );
}

export default Empty;
