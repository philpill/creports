print('- select db');
use creports
print('- drop db');
db.dropDatabase()
print('- select db');
use creports
print('- create articles collection');
db.createCollection('articles', { autoIndexID : true })