const admin = require('firebase-admin');
const serviceAccount = require('./acompanhamento-diario-firebase-adminsdk-ry66n-ab50183fec.json');

const uid = 'yx3jmX60jyg7HPUgj7WeCV0nEdO2';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://acompanhamento-diario-default-rtdb.firebaseio.com/',
});

const database = admin.database();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteAssuntos() {
  const deleteCollection = async (collectionPath) => {
    const collectionRef = database.ref(collectionPath);
    const snapshot = await collectionRef.once('value');

    snapshot.forEach(async (childSnapshot) => {
      await childSnapshot.ref.remove();
      console.log(`Document ${childSnapshot.key} deleted from collection ${collectionPath}`);
    });

    console.log(`Collection ${collectionPath} deleted successfully.`);
  };
  await deleteCollection(`v2/${uid}/areas-conhecimento`);
  await deleteCollection(`v2/${uid}/assuntos`);
  await deleteCollection(`v2/${uid}/disciplinas`);

  console.log(`All collections for user ${uid} deleted successfully.`);
}

async function migrateAssuntos() {
  try {
    // Read data from SQLite using Prisma
    const categoriasCientificas = await prisma.categoriaCientifica.findMany({
      include: {
        disciplinas: {
          include: {
            assuntos: true,
          },
        },
      },
    });

    // Write data to Realtime Database
    for (const categoria of categoriasCientificas) {
      console.log('Adding categoria: ' + categoria.nome);
      const categoriaRef = database.ref(`v2/${uid}/areas-conhecimento`).push();
      await categoriaRef.set({
        nome: categoria.nome,
      });

      for (const disciplina of categoria.disciplinas) {
        console.log('Adding disciplina: ' + disciplina.nome);
        const disciplinaRef = database.ref(`v2/${uid}/disciplinas`).push();
        await disciplinaRef.set({
          keyAreaConhecimento: categoriaRef.key,
          nome: disciplina.nome,
        });

        const dicAssuntosKey = new Map();
        for (const assunto of disciplina.assuntos) {
          console.log('Adding assunto: ' + assunto.nome);
          const assuntoRef = database.ref(`v2/${uid}/assuntos`).push();
          if (!dicAssuntosKey.has(assunto.id_assunto)) {
            dicAssuntosKey.set(assunto.id_assunto, assuntoRef.key);
          }
          assuntoRef.set({
            keyAssuntoPai: null,
            keyDisciplina: disciplinaRef.key,
            nome: assunto.nome,
          });
        }

        for (const assunto of disciplina.assuntos) {
          const assuntoPai = disciplina.assuntos.find(a => a.id_assunto === assunto.id_assunto_pai);
          const keyAssunto = dicAssuntosKey.get(assunto.id_assunto);
          const keyAssuntoPai = assuntoPai?.id_assunto > 0 ? dicAssuntosKey.get(assuntoPai.id_assunto) : null;
          const nomeAssuntoPai = assuntoPai?.id_assunto > 0 ? assuntoPai.nome : null;
          console.log(`Setting parent assunto: ${assunto.nome} => ${nomeAssuntoPai}`);
          const assuntoRef = database.ref(`v2/${uid}/assuntos/${keyAssunto}`);
          assuntoRef.update({
            keyAssuntoPai: keyAssuntoPai
          });
        }
      }
    }

    console.log('Migration successful!');
  } catch (error) {
    console.error('Error migrating data:', error);
  } finally {
    // Close Prisma client
    await prisma.$disconnect();
  }
}

async function queryAssuntos() {
  const areasConhecimentoRef = database.ref(`v2/${uid}/areas-conhecimento`);
  areasConhecimentoRef.once('value', (snapshot) => {
    snapshot.forEach((docAc) => {
      console.log(docAc.key, '=>', docAc.val());

      const disciplinasRef = database.ref(`v2/${uid}/areas-conhecimento/${docAc.key}/disciplinas`);
      disciplinasRef.once('value', (snapshotDs) => {
        snapshotDs.forEach((docDs) => {
          console.log(docDs.key, '=>', docDs.val());
        });
      });
    });
  });
}

try {
  // deleteAssuntos();
  // migrateAssuntos();
  // queryAssuntos();
} catch (e) {
  console.log(e);
}
