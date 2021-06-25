# bubble backend

Bubble social backend services.

## Guide

To run this service make sure :

1. `MONGODB_URI` Environment variable are pointing to a valid mongodb endpoint, with the required collections
2. `NEO4J_URI` Neo4J uri, `NEO4J_USERNAME`, and `NEO4J_PASSWORD` is set to the right configuration
2. `./serviceAccount.json` are available with the right data for the Firebase project

Environment can be also set using `./.env` as dotenv are installed. While the service is running, and the `NODE_ENV` environment variable are not set to production, `/docs` route are available to show documentation.

### Testing

1. Start firebase emulator for auth `firebase emulators:start --only auth --project bubble-social-8b21e`
2. Start mongodb with required collection
3. Start Neo4J
3. Set the normal environment variable
4. Set environment variable `FIREBASE_AUTH_EMULATOR_HOST=localhost:9099` or in Windows (Powershell) `$env:FIREBASE_AUTH_EMULATOR_HOST="localhost:9099"`

Do not forget to cleanup environment variable `FIREBASE_AUTH_EMULATOR_HOST`
