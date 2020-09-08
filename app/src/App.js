import React, { useState } from "react";
import "./App.css";
import Form from "./form/Form";
import Chart from "./chart/Chart";
import axios from "axios";

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ error: false, data: null });

  function onPackageNameSubmit(values) {
    // alert(JSON.stringify(values, null, 2));
    setLoading(true);
    axios
      .get(`/bundle-size?name=${values.packageName}`)
      .then(function (response) {
        setLoading(false);
        setResult({ error: false, data: response.data });
        console.log(response);
      })
      .catch(function (error) {
        setLoading(false);
        if (error.response) {
          setResult({ error: true, data: error.response.data.message });
        } else {
          setResult({ error: true, data: "Unknown Error" });
        }
      });
  }

  return (
    <div className="App">
      <Form
        onPackageNameSubmit={(values) => onPackageNameSubmit(values)}
        disabled={loading}
      />
      {(() => {
        if (loading) {
          return (
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          );
        } else {
          return <Chart result={result} />;
        }
      })()}
    </div>
  );
}

export default App;
