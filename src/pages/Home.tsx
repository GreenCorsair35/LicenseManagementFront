import Request from "../components/Request.tsx";

function Home() {
  return (
    <>
      <Request />
      {/*requests.map((request) => (
          <Request
            request={request}
            onDelete={deleteRequests}
            key={request.pk}
          />
        ))*/}
    </>
  );
}

export default Home;
