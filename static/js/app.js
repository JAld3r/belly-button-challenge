// use the d3 library to read in the samples.json from the URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.

d3.json(url).then(function(data) {
  // Function to create the bar chart
  function createBarChart(sampleID) {
    // Filter the data to get the sample with the provided ID
    const sample = data.samples.filter(s => s.id === sampleID)[0];

    // Get the top 10 OTUs
    const top10OTUs = sample.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`);
    const top10Values = sample.sample_values.slice(0, 10);
    const top10Labels = sample.otu_labels.slice(0, 10);

    // Sort the data in descending order
    const sortedIndices = top10Values.map((_, i) => i).sort((a, b) => top10Values[b] - top10Values[a]);
    const sortedOTUs = top10OTUs.map((otu, i) => top10OTUs[sortedIndices[i]]);
    const sortedValues = top10Values.map((value, i) => top10Values[sortedIndices[i]]);
    const sortedLabels = top10Labels.map((label, i) => top10Labels[sortedIndices[i]]);

    // Create the trace for the bar chart
    const trace = {
      x: sortedValues,
      y: sortedOTUs,
      text: sortedLabels,
      type: "bar",
      orientation: "h"
    };

    // Create the data array
    const barData = [trace];

    // Define the layout
    const barLayout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };

    // Plot the bar chart
    Plotly.newPlot("bar", barData, barLayout);
  }

  // Function to create the bubble chart
  function createBubbleChart(sampleID) {
    // Filter the data to get the sample with the provided ID
    const sample = data.samples.filter(s => s.id === sampleID)[0];

    // Data inputs for the bubble chart
    const bubbleData = [{
      x: sample.otu_ids,
      y: sample.sample_values,
      text: sample.otu_labels,
      mode: 'markers',
      marker: {
        size: sample.sample_values,
        color: sample.otu_ids,
        colorscale: 'Earth'
      }
    }];

    // Layout for the bubble chart
    const bubbleLayout = {
      title: "OTU Bubble Chart",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };

    // Plot the bubble chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  }

  // Function to display sample metadata
  function displayMetadata(sampleID) {
    // Filter the data to get the sample metadata with the provided ID
    const metadata = data.metadata.filter(m => m.id.toString() === sampleID)[0];

    // Select the element to display the metadata
    const metadataPanel = d3.select("#sample-metadata");

    // Clear any existing metadata
    metadataPanel.html("");

    // Display each key-value pair from the metadata JSON object
    Object.entries(metadata).forEach(([key, value]) => {
      metadataPanel
        .append("p")
        .text(`${key}: ${value}`);
    });
  }

  // Get the dropdown element
  const dropdown = d3.select("#selDataset");

  // Populate the dropdown with sample IDs
  data.names.forEach(sampleID => {
    dropdown.append("option")
      .attr("value", sampleID)
      .text(sampleID);
  });

  // Initial chart display with the first sample ID
  const initialSampleID = data.names[0];
  createBarChart(initialSampleID);
  createBubbleChart(initialSampleID);
  displayMetadata(initialSampleID);

  // Event handler for the dropdown change
  dropdown.on("change", function() {
    const selectedSampleID = d3.select(this).property("value");
    createBarChart(selectedSampleID);
    createBubbleChart(selectedSampleID);
    displayMetadata(selectedSampleID);
  });
});
