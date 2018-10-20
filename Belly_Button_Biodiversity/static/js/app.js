function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((metaData) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var metaPanel = d3.select("#sample-metadata");
    //clear any existing metadata
    metaPanel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(metaData).forEach(([key, value]) => {
      metaPanel.append("b").text((`${key}: ${value}`).toUpperCase());
      metaPanel.append("br");
    });
  });
  console.log(metaPanel)
};

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
// Add title to x-axis
    var layout = {
      xaxis: {title: 'OTU ID'},
      title: true
    };
// Dynamically create buble plot based on selected Sample
    Plotly.newPlot('bubble', trace1 , layout);

// @TODO: Build a Pie Chart
    var sampleArray = [];

    // Iterate through sample data otu_ids and push corresponding variables to empty sampleArray
    for (var i=0; i < sampleData.otu_ids.length; i++) {
      sampleArray.push({'id': sampleData.otu_ids[i],
                        'label': sampleData.otu_labels[i], 
                        'value':sampleData.sample_values[i]});
    };
// Sort sampleArray to ensure top 10 rows are sliced 
    sampleArray.sort((a, b) => b.value - a.value);
    var Sample10 = sampleArray.slice(0,10);
    console.log(Sample10);

    var trace2 = {
      values: Sample10.map((sample) => sample.value),
      labels: Sample10.map((sample) => sample.id),
      type: 'pie',
      hoverinfo: Sample10.map((sample) => sample.label)
    };
// Dynamically create new pie chart based on selected sample
    Plotly.newPlot('pie', trace2);

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