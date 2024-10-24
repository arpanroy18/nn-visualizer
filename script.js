// Get DOM elements
const input1 = document.getElementById('input1');
const weights = document.querySelectorAll('.weight');
const outputDisplay = document.getElementById('output');
const connectionsSVG = document.querySelector('.connections');

// Initialize weights object
let weightsObj = {
    layer1: [1, 1, 1, 1], // Hidden Layer 1 weights
    layer2: [1, 1, 1, 1], // Hidden Layer 2 weights
    layer3: [1, 1, 1, 1], // Hidden Layer 3 weights
    output: [1, 1, 1, 1]   // Output Layer weights
};

// Function to update weight values next to sliders
weights.forEach(weight => {
    weight.addEventListener('input', () => {
        const layer = weight.dataset.layer;
        const neuron = weight.dataset.neuron;
        const value = weight.value;
        document.getElementById(`w${layer}-${neuron}`).innerText = value;
        weightsObj[`layer${layer}`][neuron - 1] = parseFloat(value);
        calculateOutput();
    });
});

// Function to calculate the output
function calculateOutput() {
    const inputVal = parseFloat(input1.value);

    // Forward Pass
    // Hidden Layer 1
    let h1 = [];
    for (let i = 0; i < weightsObj.layer1.length; i++) {
        h1[i] = inputVal * weightsObj.layer1[i];
    }

    // Hidden Layer 2
    let h2 = [];
    for (let i = 0; i < weightsObj.layer2.length; i++) {
        // Simple activation: sum of previous layer
        let sum = h1.reduce((a, b) => a + b, 0);
        h2[i] = sum * weightsObj.layer2[i];
    }

    // Hidden Layer 3
    let h3 = [];
    for (let i = 0; i < weightsObj.layer3.length; i++) {
        // Simple activation: sum of previous layer
        let sum = h2.reduce((a, b) => a + b, 0);
        h3[i] = sum * weightsObj.layer3[i];
    }

    // Output Layer
    let output = 0;
    for (let i = 0; i < weightsObj.output.length; i++) {
        output += h3[i] * weightsObj.output[i];
    }

    outputDisplay.innerText = output.toFixed(2);
}

// Initial calculation
calculateOutput();

// Update output when input changes
input1.addEventListener('input', calculateOutput);

// Function to get the center coordinates of a node
function getNodeCenter(node) {
    const rect = node.getBoundingClientRect();
    const parentRect = document.querySelector('.network-container').getBoundingClientRect();
    return {
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top + rect.height / 2
    };
}

// Function to draw connections
function drawConnections() {
    // Clear existing connections
    connectionsSVG.innerHTML = '';

    // Define layers
    const layers = [
        document.querySelector('.input-layer'),
        document.getElementById('hidden-layer-1'),
        document.getElementById('hidden-layer-2'),
        document.getElementById('hidden-layer-3'),
        document.querySelector('.output-layer')
    ];

    // Iterate through each pair of consecutive layers
    for (let i = 0; i < layers.length - 1; i++) {
        const currentLayerNodes = layers[i].querySelectorAll('.node');
        const nextLayerNodes = layers[i + 1].querySelectorAll('.node');

        currentLayerNodes.forEach(currentNode => {
            const from = getNodeCenter(currentNode);

            nextLayerNodes.forEach(nextNode => {
                const to = getNodeCenter(nextNode);

                // Create a line element
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', from.x);
                line.setAttribute('y1', from.y);
                line.setAttribute('x2', to.x);
                line.setAttribute('y2', to.y);
                line.setAttribute('stroke', '#999');
                line.setAttribute('stroke-width', '1.5'); // Slightly thinner lines

                connectionsSVG.appendChild(line);
            });
        });
    }
}

// Draw connections initially
window.addEventListener('load', () => {
    drawConnections();
    calculateOutput();
});

// Redraw connections on window resize to maintain layout
window.addEventListener('resize', drawConnections);
