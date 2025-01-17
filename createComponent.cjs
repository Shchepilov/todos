const fs = require('fs');
const path = require('path');

const componentName = process.argv[2];

if (!componentName) {
  console.log('Please provide a component name.');
  process.exit(1);
}

const componentDir = path.join(__dirname, 'src', 'components', componentName);

if (!fs.existsSync(componentDir)) {
  fs.mkdirSync(componentDir, { recursive: true });
}

const componentTemplate = `
import styles from './${componentName}.module.scss';

const ${componentName} = () => {
  return (
    <div className={styles.${componentName}}>Hello, ${componentName}!</div>
  );
};

export default ${componentName};
`;

//const componentIndex = `export * from './${componentName}';`;

const styleTemplate = `.${componentName} {}`;

fs.writeFileSync(path.join(componentDir, `${componentName}.jsx`), componentTemplate);
//fs.writeFileSync(path.join(componentDir, `index.js`), componentIndex);
fs.writeFileSync(path.join(componentDir, `${componentName}.module.scss`), styleTemplate);

console.log(`Component ${componentName} created successfully!`);