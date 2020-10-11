function initializeCharts() {
    let chart = new CanvasJS.Chart("chartContainer", {
        title:{
            text: "My First Chart in CanvasJS"
        },
        data: [
            {
                // Change type to "doughnut", "line", "splineArea", etc.
                type: "line",
                dataPoints:
                    [
                        { label: "apple",  y: 10  },
                        { label: "orange", y: 15  },
                        { label: "banana", y: 25  },
                        { label: "mango",  y: 30  },
                        { label: "grape",  y: 8  }
                    ]
            }
        ]
    });
    chart.render();
}