import React from "react";
import filesize from "filesize.js";
import "./Chart.css";

function SizeBar(props) {
  const gzSizeStyle = {
    height: `${Math.floor((props.sizeGzip / props.max) * 100)}%`,
  };
  const sizeStyle = {
    height: `${Math.floor(((props.size - props.sizeGzip) / props.max) * 100)}%`,
  };
  return (
    <div className="bar">
      <div style={sizeStyle} className="size">
        <div className="size-label">{filesize(props.size)}</div>
      </div>
      <div style={gzSizeStyle} className="gz-size">
        <div className="size-label">{filesize(props.sizeGzip)}</div>
      </div>
    </div>
  );
}

function Chart(props) {
  if (props.result.data === null) {
    return null;
  } // nothing to display
  if (props.result.error) {
    return <div>{props.result.data}</div>;
  } // error display

  // chart display
  const packageDatas = props.result.data;
  const maxSize = packageDatas.reduce(function (a, b) {
    return { size: Math.max(a.size || 0, b.size || 0) };
  }).size;

  let listItems = packageDatas.map((packageData) => {
    if (packageData.error) {
      return (
        <div key={packageData.version}>
          <div className="bar error">could not calculate</div>
          <div className="version">{packageData.version}</div>
        </div>
      );
    }
    return (
      <div key={packageData.version}>
        <SizeBar
          max={maxSize}
          size={packageData.size}
          sizeGzip={packageData.sizeGzip}
        />
        <div className="version">{packageData.version}</div>
      </div>
    );
  });

  if (packageDatas.length < 4) {
    // add special bar when no major version
    listItems.unshift(
      <div key={0} className="bar error">
        No previous major version
      </div>
    );
  }
  return (
    <div>
      <div className="d-flex justify-content-center">
        <span className="minimified">Minimified</span>
        <span className="gziped">Gziped</span>
      </div>
      <div className="chart">{listItems}</div>
    </div>
  );
}

export default Chart;
