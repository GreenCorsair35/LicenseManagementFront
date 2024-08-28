import { useState, useEffect } from "react";
import api from "../api";
import Request from "../components/Request";

function Home() {
  const [requests, setRequests] = useState([]);
  const [usageReason, setUsageReason] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    getRequests();
  }, []);

  const getRequests = () => {
    api
      .get("/licensemanagementapi/requests/")
      .then((res) => res.data.results)
      .then((data) => {
        setRequests(data);
        console.log(data);
      })
      .catch((error) => alert(error));
  };

  const deleteRequests = () => {
    api
      .delete(`/api/requestes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Request deleted!");
        else alert("failed to delete request!");
        getRequests();
      })
      .catch((error) => alert(error));
  };

  const createRequest = (e) => {
    e.preventDefault();
    api
      .post("/licensemanagementapi/requests/", { usageReason, status })
      .then((res) => {
        if (res.status === 201) alert("Request created!");
        else alert("failed to create request!");
        getRequests();
      })
      .catch((error) => alert(error));
  };

  return (
    <div>
      <div>
        <Request requests={requests} />
        {/*requests.map((request) => (
          <Request
            request={request}
            onDelete={deleteRequests}
            key={request.pk}
          />
        ))*/}
      </div>
      <h2>Create a Request</h2>
      <form onSubmit={createRequest}>
        <label htmlFor="usage_reason">Usage Reason</label>
        <br />
        <textarea
          type="text"
          id="usage_reason"
          name="usage_reason"
          required
          onChange={(e) => setUsageReason(e.target.value)}
          value={usageReason}
        />
        <br />
        <label htmlFor="status">Status</label>
        <br />
        <input
          type="text"
          id="status"
          name="status"
          required
          onChange={(e) => setStatus(e.target.value)}
          value={status}
        />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Home;
