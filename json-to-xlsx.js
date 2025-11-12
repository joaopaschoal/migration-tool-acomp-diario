const fs = require("fs");
const ExcelJS = require("exceljs");

// Leitura do arquivo JSON
const jsonData = fs.readFileSync("./data.json", "utf8");
const data = JSON.parse(jsonData);

// Função para escrever no Excel
async function writeToExcel(data) {
  const workbook = new ExcelJS.Workbook();

  // Adiciona uma aba para cada entidade
  for (const entityName in data) {
    if (data.hasOwnProperty(entityName)) {
      const entityData = data[entityName];
      const worksheet = workbook.addWorksheet(entityName);

      // Adiciona os cabeçalhos
      const headers = Object.keys(entityData[0] || {});
      worksheet.addRow(headers);

      // Adiciona os dados
      entityData.forEach((row) => {
        const values = headers.map((header) => row[header]);
        worksheet.addRow(values);
      });
    }
  }

  // Salva o arquivo Excel
  await workbook.xlsx.writeFile("output.xlsx");
  console.log("Excel criado com sucesso!");
}

// Função para converter dados em formato adequado para o CSV
function convertToRelational(data) {
  const acompanhamentos = Object.entries(data["acompanhamentos"]).map(([key, value]) => ({
    id: key,
    data_referente: value.dataReferente,
    data_registro: value.dataRegistro,
  }));

  const areasConhecimento = Object.entries(data["areas-conhecimento"]).map(([key, value]) => ({
    id: key,
    nome: value.nome,
  }));

  const assuntos = Object.entries(data["assuntos"]).map(([key, value]) => ({
    id: key,
    nome: value.nome,
    id_disciplina: value.keyDisciplina,
    id_assunto_pai: value.keyAssuntoPai,
  }));

  const atividades = Object.entries(data["atividades"]).map(([key, value]) => ({
    id: key,
    minutos: value.minutos,
    id_acompanhamento: value.keyAcompanhamento,
    id_tipo_atividade: value.keyTipoAtividade,
    tipo: value.tipo,
  }));

  const autocuidados = Object.entries(data["auto-cuidados"]).map(([key, value]) => ({
    id: key,
    minutos: value.minutos,
    id_acompanhamento: value.keyAcompanhamento,
    id_tipo_autocuidado: value.keyTipoAutocuidado,
    tipo: value.tipo,
  }));

  const clientes = Object.entries(data["clientes"]).map(([key, value]) => ({
    id: key,
    nome: value.nome,
  }));

  const disciplinas = Object.entries(data["disciplinas"]).map(([key, value]) => ({
    id: key,
    nome: value.nome,
    id_area_conhecimento: value.keyAreaConhecimento,
  }));

  const estudos = Object.entries(data["estudos"]).map(([key, value]) => ({
    id: key,
    minutos: value.minutos,
    id_acompanhamento: value.keyAcompanhamento,
    id_assunto: value.keyAssunto,
    tipo: value.tipo,
  }));

  const projetos = Object.entries(data["projetos"]).map(([key, value]) => ({
    id: key,
    nome: value.nome,
    id_cliente: value.keyCliente,
    id_tecnologia_principal: value.keyTecnologiaPrincipal,
  }));

  const projetosTecnologia = Object.entries(data["projetos-tecnologia"]).map(([key, value]) => ({
    id: key,
    is_tecnologia_principal: value.isTecnologiaPrincipal,
    id_projeto: value.keyProjeto,
    id_tecnologia: value.keyTecnologia,
  }));

  const tecnologias = Object.entries(data["tecnologias"]).map(([key, value]) => ({
    id: key,
    nome: value.nome,
  }));

  const tiposAtividade = Object.entries(data["tipos-atividade"]).map(([key, value]) => ({
    id: key,
    nome: value.nome,
  }));

  const tiposAutocuidado = Object.entries(data["tipos-autocuidado"]).map(([key, value]) => ({
    id: key,
    nome: value.nome,
  }));

  const trabalhos = Object.entries(data["trabalhos"]).map(([key, value]) => ({
    id: key,
    minutos: value.minutos,
    id_acompanhamento: value.keyAcompanhamento,
    id_projeto: value.keyProjeto,
    tipo: value.tipo,
  }));

  // Retorne os dados formatados para cada entidade
  return {
    acompanhamentos,
    areasConhecimento,
    assuntos,
    atividades,
    autocuidados,
    clientes,
    disciplinas,
    estudos,
    projetos,
    projetosTecnologia,
    tecnologias,
    tiposAtividade,
    tiposAutocuidado,
    trabalhos,
    // Adicione mais entidades conforme necessário
  };
}

const relationalData = convertToRelational(data);

// Executa a função para escrever no Excel
writeToExcel(relationalData);
