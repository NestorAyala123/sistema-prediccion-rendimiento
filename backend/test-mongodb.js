const mongoose = require('mongoose');

async function testMongoConnection() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/academic_prediction';
  
  console.log('🔍 Probando conexión a MongoDB...');
  console.log('📍 URI:', MONGODB_URI);
  
  try {
    await mongoose.connect(MONGODB_URI);
    
    console.log('✅ Conexión exitosa a MongoDB!');
    console.log('💾 Base de datos:', mongoose.connection.name);
    
    // Listar colecciones existentes
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Colecciones existentes:');
    if (collections.length === 0) {
      console.log('   (ninguna - base de datos nueva)');
    } else {
      collections.forEach(col => console.log(`   - ${col.name}`));
    }
    
    // Crear colección de prueba
    console.log('\n🔧 Creando colección de prueba...');
    const testCollection = mongoose.connection.collection('test_conexion');
    const result = await testCollection.insertOne({
      mensaje: 'Prueba de conexión exitosa',
      fecha: new Date(),
      tipo: 'test'
    });
    console.log('✅ Documento de prueba insertado con ID:', result.insertedId);
    
    // Leer el documento de prueba
    const testDoc = await testCollection.findOne({ tipo: 'test' });
    console.log('📖 Documento recuperado:', testDoc ? '✅' : '❌');
    
    // Limpiar documento de prueba
    await testCollection.deleteOne({ tipo: 'test' });
    console.log('🧹 Documento de prueba eliminado');
    
    console.log('\n✨ ¡Todo funcionando correctamente!');
    console.log('\n📝 Puedes iniciar el backend con: npm run start:dev');
    
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:');
    console.error(error.message);
    process.exit(1);
  }
}

// Ejecutar prueba
testMongoConnection();
