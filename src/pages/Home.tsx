import Request from "../components/Request.tsx";
import { useState, useEffect } from "react";
import api from "../api";

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
