
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }


function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
    //console.log(data);
    var samples=data.samples;
    //console.log(samples);
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    //console.log(result);
    var otu_ids= result.otu_ids;
    var otu_labels= result.otu_labels;
    var sample_values=result.sample_values;

    //Build a bubble chart
    var bubbleLayout={
        title: "Bacteria culture per sample",
        margin:{t:0},
        hovermode: "closest",
        xasis: {titile:"OTU ID"},
        margin:{t:30}
    };
    var bubbleData=[{
        x:otu_ids,
        y:sample_values,
        mode:"markers",
        marker:{
            size:sample_values,
            color:otu_ids,
            colorscale:"Earth"
        }
    }];

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);


    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData=[
        {
            y:yticks,
            x:sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type:"bar",
            orientation:"h"
        }
    ];

    var barLayout={
        title:"top 10 Bacteria Culture Found",
        margin:{t:30,l:150}
    };

    Plotly.newPlot("bar", barData, barLayout);
    
    });  
}

function init(){
    //Reference to the dropdown select element
    var selector= d3.select("#selDataset");
    
    //use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
        var sampleNames= data.names;

        sampleNames.forEach((sample) =>{
            selector.append("option").text(sample).property("value",sample);
        });

        var firstSample= sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);

    });
}


function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }

//initialize the dashboard
init();