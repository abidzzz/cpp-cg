// Add Variable Button
document.getElementById('addVariableButton').addEventListener('click', function () {
    const fieldsContainer = document.getElementById('fieldsContainer');
    const newFieldGroup = document.createElement('div');
    newFieldGroup.className = 'field-group';
    newFieldGroup.innerHTML = `
      <select class="variableType">
          <option value="int">int</option>
          <option value="string">string</option>
          <option value="float">float</option>
          <option value="double">double</option>
          <option value="char">char</option>
          <option value="bool">bool</option>  
          <option value="void">void</option>
      </select>
      <input type="text" class="variableName" placeholder="Variable name (e.g., x)">
      <button type="button" class="removeButton"><i class="fas fa-trash"></i></button>
    `;
    fieldsContainer.appendChild(newFieldGroup);
  });
  
  // Add Input Statement Button
  document.getElementById('addInputButton').addEventListener('click', function () {
    const fieldsContainer = document.getElementById('fieldsContainer');
    const newFieldGroup = document.createElement('div');
    newFieldGroup.className = 'field-group';
    newFieldGroup.innerHTML = `
        <select class="variableType">
          <option value="int">int</option>
          <option value="string">string</option>
          <option value="float">float</option>
          <option value="double">double</option>
          <option value="char">char</option>
          <option value="bool">bool</option>  
          <option value="void">void</option>
        </select>
      <input type="text" class="inputStatement" placeholder="Input statement (e.g., name)">
      <button type="button" class="removeButton"><i class="fas fa-trash"></i></button>
    `;
    fieldsContainer.appendChild(newFieldGroup);
  });
  
  // Remove Field Logic
  document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('removeButton')) {
      e.target.parentElement.remove();
    }
  });
  
  // Generate Code Logic
  document.getElementById('codeForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    // Get all variable declarations
    const variableGroups = Array.from(document.querySelectorAll('.field-group'));
    let variables = '';
    let inputStatements = '';
    let outputStatements = '';
  
    variableGroups.forEach(group => {
      const variableType = group.querySelector('.variableType')?.value;
      const variableName = group.querySelector('.variableName')?.value.trim();
      const inputStatement = group.querySelector('.inputStatement')?.value.trim();
  
      if (variableType && variableName) {
        // Add variable declaration
        const variableNames = variableName.split(',').map(v => v.trim());
        variableNames.forEach((variable, index) => {
            if (index === 0) {
                outputStatements += `\tcout << ${variable}`;
            } else {
                outputStatements += ` << " " << ${variable}`;
            }
        });
        outputStatements += ` << endl;\n`;
        variables += `\t${variableType} ${variableName};\n`;
  
        
        // Add output statement
        // outputStatements += `\tcout << "${variableName}: " << ${variableName} << endl;\n`;
      }
      else if (inputStatement){
        inputStatements += `\t${variableType} ${inputStatement};\n`;
        const inputVars = inputStatement.split(',').map(v => v.trim());
        inputVars.forEach(inputVar => {
          inputStatements += `\tcout << "Enter ${inputVar}: ";\n`;
          inputStatements += `\tcin >> ${inputVar};\n\n`;
        });
      }
    });

  
    // Generate C++ code
    const code = `
#include <iostream>
using namespace std;
  
int main() {
${variables}
${inputStatements}
${outputStatements}
\treturn 0;
}
  `;
  
    // Display generated code
    const codeElement = document.getElementById('generatedCode');
    codeElement.textContent = code;
  
    // Show download button
    const downloadButton = document.getElementById('downloadButton');
    downloadButton.style.display = 'block';
    downloadButton.onclick = () => downloadCode(code);

    const copyButton = document.getElementById('copyButton');
    copyButton.style.display = 'block';
    
  });
  
  // Function to download the generated code as a .cpp file
  function downloadCode(code) {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_code.cpp';
    a.click();
    URL.revokeObjectURL(url);
  }

  document.getElementById('copyButton').addEventListener('click', function () {
    const codeElement = document.getElementById('generatedCode');
    const code = codeElement.textContent;
    navigator.clipboard.writeText(code).then(function () {
        alert('Code copied to clipboard!');
    }).catch(function (err) {
        alert('Error copying code: ' + err);
    });
  
  })