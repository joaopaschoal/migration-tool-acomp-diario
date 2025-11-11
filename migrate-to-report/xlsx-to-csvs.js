const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// Função para converter camelCase para snake_case
const camelToSnake = (str) => {
  return str
    .replace(/([A-Z])/g, '_$1') // Adiciona um underscore antes de letras maiúsculas
    .toLowerCase(); // Converte tudo para minúsculas
};

const exportExcelToCSV = async (inputFilePath) => {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.readFile(inputFilePath);

  const outputDir = path.join(__dirname, 'exported_csvs');

  // Cria a pasta se não existir
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Itera por cada aba no workbook
  workbook.worksheets.forEach(async (worksheet) => {
    const csvData = [];

    // Lê as linhas da planilha
    worksheet.eachRow((row, rowNumber) => {
      const rowValues = row.values.map((value) => {
        if (typeof value === 'string') {
          return `"${value}"`; // Coloca aspas duplas para strings
        }
        return value; // Mantém outros tipos como estão
      });
      csvData.push(rowValues.join(',')); // Junta os valores da linha com vírgulas
    });

    // Converte o nome da aba para snake_case
    const fileName = `${camelToSnake(worksheet.name)}.csv`;
    const filePath = path.join(outputDir, fileName);

    // Escreve o CSV no arquivo
    fs.writeFileSync(filePath, csvData.join('\n'), { encoding: 'utf8' });
    console.log(`Exported: ${filePath}`);
  });
};

// Chame a função com o caminho do seu arquivo Excel
const inputFilePath = 'output.xlsx';
exportExcelToCSV(inputFilePath).catch(console.error);
