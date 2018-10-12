
// var $selDataset = document.getElementById("selDataset");
// var $sampleMetadata = document.getElementById("metadata");
// var $pie = document.getElementById("pie");
// @TODO: Complete the following function that builds the metadata panel
function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
  const url = "/metadata/<sample>";
  // Fetch the JSON data and console log it
  d3.json(url).then(function(data) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var metaPanel = d3.select("#sample-metadata");
    //clear any existing metadata
    metaPanel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key,value]) => {
      metaPanel.append("b").text(('${key}:${value}'));
      metaPanel.append("br")
    });
  });
  console.log(sampleData);
  console.log(metaPanel)
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((sampleData) => {

    var trace1 = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      mode: 'markers',
      type: 'scatter',
      text: sampleData.otu_labels,
      marker: { size: sampleData.sample_values,
                color: sampleData.otu_ids
             }
    };

    var data = [trace1];

    var layout = {
      xaxis: {title: 'OTU ID'},
      title: true
    };

    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    var sampleArray = [];

    for (var i=0; i < sampleData.otu_ids.length; i++) {
      sampleArray.push({'id': sampleData.otu_ids[i],'label': sampleData.otu_labels[i], 'value':sampleData.sample_values[i]});
    };

    sampleArray.sort((first, second) => second.value - first.value);
    var Sample10 = sampleArray.slice(0,10);
    console.log(Sample10);

    var trace2 = {
      values: Sample10.map((sample) => sample.value),
      labels: Sample10.map((sample) => sample.id),
      type: 'pie',
      hoverinfo: Sample10.map((sample) => sample.label)
    };

    var data2 = [trace2];

    Plotly.newPlot('pie', data2);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();