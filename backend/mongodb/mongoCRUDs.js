const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");

function MongoCRUDs(db_name, uri) {
  this.db_name = db_name;
  this.uri = uri;
}
function MongoCRUDs() {
  const db_user = "webdev_admin";
  const db_pswd = "z23KllPSv";
  const db_name = "webdev";
  const dbHostname = "mongodb1.f4.htw-berlin.de";
  const dbPort = 27017;
  const uri = `mongodb://${db_user}:${db_pswd}@${dbHostname}:${dbPort}/${db_name}`;
  this.uri = uri;
  this.db_name = db_name;
}

MongoCRUDs.prototype.findOneUser = async function (username, password) {
  const client = new MongoClient(this.uri);
  try {
    await client.connect();
    const database = client.db(this.db_name);
    const users = database.collection('users');
    const query = { username, password };
    const user = await users.findOne(query);
    if (user) {
      delete user.password;
    }
    return user;
  } finally {
    await client.close();
  }
};

MongoCRUDs.prototype.createUser = async function (userData) {
  const client = new MongoClient(this.uri);
  try {
    await client.connect();
    const database = client.db(this.db_name);
    const users = database.collection('users');
    const result = await users.insertOne(userData);
    const insertedUser = await users.findOne({ _id: result.insertedId });
    const insertedUserName = insertedUser ? insertedUser.name : 'Unknown';
    console.log(`User ${insertedUserName} created with ID: ${result.insertedId}`);
    return result.insertedId;
  } finally {
    await client.close();
  }
};

MongoCRUDs.prototype.getAllUsers = async function () {
  const client = new MongoClient(this.uri);
  try {
    await client.connect();
    const database = client.db(this.db_name);
    const users = database.collection('users');
    const cursor = users.find({}, { projection: { password: 0 } });
    return await cursor.toArray();
  } finally {
    await client.close();
  }
};


MongoCRUDs.prototype.createLocation = async function (locationData) {
  const client = new MongoClient(this.uri);
  try {
    const database = client.db(this.db_name);
    const locations = database.collection('locations');
    const result = await locations.insertOne(locationData);
    const insertedLoc = await locations.findOne({ _id: result.insertedId });
    const insertedLocName = insertedLoc ? insertedLoc.name : 'Unknown';
    console.log(`Location ${insertedLocName} mit id ${result.insertedId} created`)
    return result.insertedId;
  } finally {
    await client.close();
  }
};

MongoCRUDs.prototype.getLocation = async function (locationId) {
  const client = new MongoClient(this.uri);
  try {
    await client.connect();
    const database = client.db(this.db_name);
    const locations = database.collection('locations');
    const query = { _id: new ObjectId(locationId) };
    return await locations.findOne(query);
  } finally {
    await client.close();
  }
};

MongoCRUDs.prototype.getAllLocations = async function () {
  const client = new MongoClient(this.uri);
  try {
    const database = client.db(this.db_name);
    const locations = database.collection('locations');
    const cursor = locations.find({});
    return await cursor.toArray();
  } finally {
    await client.close();
  }
};

MongoCRUDs.prototype.updateLocation = async function (locationId, updateData) {
  const client = new MongoClient(this.uri);
  try {
    const database = client.db(this.db_name);
    const locations = database.collection('locations');
    const filter = { _id: locationId };
    const update = { $set: updateData };
    return await locations.updateOne(filter, update);
  } finally {
    await client.close();
  }
};

MongoCRUDs.prototype.deleteLocation = async function (locationId) {
  const client = new MongoClient(this.uri);
  try {
    const database = client.db(this.db_name);
    const locations = database.collection('locations');
    const query = { _id: locationId };
    return await locations.deleteOne(query);
  } finally {
    await client.close();
  }
};

MongoCRUDs.prototype.deleteAllUsers = async function () {
  const client = new MongoClient(this.uri);
  try {
    await client.connect();
    const database = client.db(this.db_name);
    const users = database.collection('users');
    const result = await users.deleteMany({});
    console.log(result.deletedCount + ' users deleted');
    return result;
  } finally {
    await client.close();
  }
};

MongoCRUDs.prototype.deleteUserById = async function (userId) {
  const client = new MongoClient(this.uri);
  try {
    await client.connect();
    const database = client.db(this.db_name);
    const users = database.collection('users');
    const query = { _id: new ObjectId(userId) };
    const result = await users.deleteOne(query);
    console.log(`User with ID ${userId} deleted`);
    return result;
  } finally {
    await client.close();
  }
};



const mongoCRUDs = new MongoCRUDs();

module.exports = MongoCRUDs;


