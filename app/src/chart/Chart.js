import React from "react";

function Chart(props) {
  console.log(props);
  if (props.result.data === null) {
    return null;
  }
  if (props.result.error) {
    return <div>{props.result.data}</div>;
  }
  const packageDatas = props.result.data;
  const listItems = packageDatas.map((packageData, index) => (
    <li key={index}>
      <div>{packageData.size}</div>
      <div>{packageData.sizeGzip}</div>
      <div>{packageData.version}</div>
    </li>
  ));
  return (
    <div>
      <div>{packageDatas[0].packageName}</div>
      <ul>{listItems}</ul>
    </div>
  );
}

export default Chart;
