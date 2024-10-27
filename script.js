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

// Function to render the current neural network equation
function updateNeuralEquation() {
    const inputVal = parseFloat(input1.value);
    
    // Get current weights from the weight sliders
    const w1 = weightsObj.layer1;
    const w2 = weightsObj.layer2;
    const w3 = weightsObj.layer3;
    const outputWeights = weightsObj.output;

    // Create LaTeX representation using matrices
    const equation = `
    \\begin{aligned}
    &\\text{Input:} \\quad x = ${inputVal} \\\\
    &\\text{Weight Matrix for Layer 1:} \\quad W_1 = \\begin{bmatrix} ${w1[0]} & ${w1[1]} & ${w1[2]} & ${w1[3]} \\end{bmatrix} \\\\
    &\\text{Hidden Layer 1 Output:} \\quad h_1 = x \\times W_1 = \\begin{bmatrix} (${inputVal} \\times ${w1[0]}) & (${inputVal} \\times ${w1[1]}) & (${inputVal} \\times ${w1[2]}) & (${inputVal} \\times ${w1[3]}) \\end{bmatrix} \\\\
    &\\text{Weight Matrix for Layer 2:} \\quad W_2 = \\begin{bmatrix} ${w2[0]} & ${w2[1]} & ${w2[2]} & ${w2[3]} \\end{bmatrix} \\\\
    &\\text{Hidden Layer 2 Output:} \\quad h_2 = h_1 \\times W_2 = \\begin{bmatrix} h_{1_1} \\times ${w2[0]}, h_{1_2} \\times ${w2[1]}, h_{1_3} \\times ${w2[2]}, h_{1_4} \\times ${w2[3]} \\end{bmatrix} \\\\
    &\\text{Weight Matrix for Layer 3:} \\quad W_3 = \\begin{bmatrix} ${w3[0]} & ${w3[1]} & ${w3[2]} & ${w3[3]} \\end{bmatrix} \\\\
    &\\text{Hidden Layer 3 Output:} \\quad h_3 = h_2 \\times W_3 = \\begin{bmatrix} h_{2_1} \\times ${w3[0]}, h_{2_2} \\times ${w3[1]}, h_{2_3} \\times ${w3[2]}, h_{2_4} \\times ${w3[3]} \\end{bmatrix} \\\\
    &\\text{Output Layer:} \\quad y = h_3 \\times W_{output} = \\begin{bmatrix} h_{3_1} \\times ${outputWeights[0]} & h_{3_2} \\times ${outputWeights[1]} & h_{3_3} \\times ${outputWeights[2]} & h_{3_4} \\times ${outputWeights[3]} \\end{bmatrix} \\\\
    \\end{aligned}
    `;

    // Update the LaTeX code inside the #neural-equation div
    document.getElementById('neural-equation').innerHTML = `$$${equation}$$`;

    // Re-render the MathJax output
    MathJax.typeset();
}


// Call updateNeuralEquation() after any changes in input or weights
input1.addEventListener('input', updateNeuralEquation);
weights.forEach(weight => weight.addEventListener('input', updateNeuralEquation));

// Initial equation rendering
updateNeuralEquation();

// Redraw connections on window resize to maintain layout
window.addEventListener('resize', drawConnections);
