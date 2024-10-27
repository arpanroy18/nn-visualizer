// Get DOM elements
const input1 = document.getElementById('input1');
const weights = document.querySelectorAll('.weight');
const outputDisplay = document.getElementById('output');
const connectionsSVG = document.querySelector('.connections');

// Initialize weights object for each layer
let weightsObj = {
    layer1: [1, 1, 1, 1], // Hidden Layer 1 weights
    layer2: [1, 1, 1, 1], // Hidden Layer 2 weights
    layer3: [1, 1, 1, 1], // Hidden Layer 3 weights
    output: [1, 1, 1, 1]   // Output Layer weights
};

// Update weight values next to sliders and recalculate output
weights.forEach(weight => {
    weight.addEventListener('input', () => {
        const layer = weight.dataset.layer;
        const neuron = weight.dataset.neuron;
        const value = parseFloat(weight.value);

        // Update weight display and weights object
        document.getElementById(`w${layer}-${neuron}`).innerText = value;
        weightsObj[`layer${layer}`][neuron - 1] = value;

        // Recalculate output
        calculateOutput();
    });
});

// Calculate the output of the neural network
function calculateOutput() {
    const inputVal = parseFloat(input1.value);

    // Forward pass through hidden layers and output layer
    const h1 = weightsObj.layer1.map(w => inputVal * w);
    const h2 = weightsObj.layer2.map(w => h1.reduce((sum, val) => sum + val, 0) * w);
    const h3 = weightsObj.layer3.map(w => h2.reduce((sum, val) => sum + val, 0) * w);

    // Calculate final output by summing weighted h3 values
    const output = h3.reduce((sum, val, i) => sum + (val * weightsObj.output[i]), 0);

    // Display the result
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

// Function to draw connections between layers
function drawConnections() {
    // Clear existing connections
    connectionsSVG.innerHTML = '';

    // Define layers to connect
    const layers = [
        document.querySelector('.input-layer'),
        document.getElementById('hidden-layer-1'),
        document.getElementById('hidden-layer-2'),
        document.getElementById('hidden-layer-3'),
        document.querySelector('.output-layer')
    ];

    // Draw connections between consecutive layers
    layers.forEach((layer, i) => {
        if (i >= layers.length - 1) return; // Skip the last layer

        const currentLayerNodes = layer.querySelectorAll('.node');
        const nextLayerNodes = layers[i + 1].querySelectorAll('.node');

        currentLayerNodes.forEach(currentNode => {
            const from = getNodeCenter(currentNode);
            nextLayerNodes.forEach(nextNode => {
                const to = getNodeCenter(nextNode);

                // Create line element for connections
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', from.x);
                line.setAttribute('y1', from.y);
                line.setAttribute('x2', to.x);
                line.setAttribute('y2', to.y);
                line.setAttribute('stroke', '#999');
                line.setAttribute('stroke-width', '1.5'); // Thinner lines for clarity

                connectionsSVG.appendChild(line);
            });
        });
    });
}

// Draw connections when the window loads
window.addEventListener('load', () => {
    drawConnections();
    calculateOutput();
});

// Render the neural network equation using LaTeX
function updateNeuralEquation() {
    const inputVal = parseFloat(input1.value);
    const { layer1: w1, layer2: w2, layer3: w3, output: outputWeights } = weightsObj;

    // Create LaTeX representation of the current network
    const equation = `
    \\begin{aligned}
    &\\text{Input:} \\quad x = ${inputVal} \\\\
    &\\text{Weight Matrix for Layer 1:} \\quad W_1 = \\begin{bmatrix} ${w1.join(' & ')} \\end{bmatrix} \\\\
    &\\text{Hidden Layer 1 Output:} \\quad h_1 = x \\times W_1 = \\begin{bmatrix} (${inputVal} \\times ${w1[0]}) & (${inputVal} \\times ${w1[1]}) & (${inputVal} \\times ${w1[2]}) & (${inputVal} \\times ${w1[3]}) \\end{bmatrix} \\\\
    &\\text{Weight Matrix for Layer 2:} \\quad W_2 = \\begin{bmatrix} ${w2.join(' & ')} \\end{bmatrix} \\\\
    &\\text{Hidden Layer 2 Output:} \\quad h_2 = h_1 \\times W_2 = \\begin{bmatrix} h_{1_1} \\times ${w2[0]}, h_{1_2} \\times ${w2[1]}, h_{1_3} \\times ${w2[2]}, h_{1_4} \\times ${w2[3]} \\end{bmatrix} \\\\
    &\\text{Weight Matrix for Layer 3:} \\quad W_3 = \\begin{bmatrix} ${w3.join(' & ')} \\end{bmatrix} \\\\
    &\\text{Hidden Layer 3 Output:} \\quad h_3 = h_2 \\times W_3 = \\begin{bmatrix} h_{2_1} \\times ${w3[0]}, h_{2_2} \\times ${w3[1]}, h_{2_3} \\times ${w3[2]}, h_{2_4} \\times ${w3[3]} \\end{bmatrix} \\\\
    &\\text{Output Layer:} \\quad y = h_3 \\times W_{output} = \\begin{bmatrix} h_{3_1} \\times ${outputWeights[0]} & h_{3_2} \\times ${outputWeights[1]} & h_{3_3} \\times ${outputWeights[2]} & h_{3_4} \\times ${outputWeights[3]} \\end{bmatrix} \\\\
    \\end{aligned}
    `;

    // Update LaTeX equation in DOM
    document.getElementById('neural-equation').innerHTML = `$$${equation}$$`;
    MathJax.typeset();
}

// Update equation and output on input change
input1.addEventListener('input', updateNeuralEquation);
weights.forEach(weight => weight.addEventListener('input', updateNeuralEquation));

// Initial equation rendering
updateNeuralEquation();

// Redraw connections on window resize
window.addEventListener('resize', drawConnections);
