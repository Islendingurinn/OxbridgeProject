# OxbridgeBackend

## Setup

1. npm install
2. create initial mongoDB as shown below
3. enable mongodb authentication (https://docs.mongodb.com/manual/tutorial/enable-authentication/)
4. create the .env file from the .env.example file (and edit to fit credentials)
5. npm start

## Initial mongoDB

db.createUser({
    user: user,
    pwd: password,
    roles: [{ role: 'readWrite', db: dbName }],
});

db.createCollection('api_keys');
db.createCollection('roles');

db.api_keys.insert({
    metadata: 'Information to describe the usage',
    key: 'api key',
    version: 1,
    status: true,
});

db.roles.insertMany([
    { code: 'USER', status: true },
    { code: 'ADMIN', status: true },
  ]);
}

## Testing

1. create the .env.test file from the .env.test.example file (and edit to fit credentials) 
2. npm test