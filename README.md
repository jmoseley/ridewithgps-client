# ridewithgps-client

Node client for the RideWithGPS API (https://ridewithgps.com/api)

# Usage

```
const client = new RideWithGPSClient('api-key');

const user = await client.authenticateUser('email@example.com', 'myCoolPassword');
// Save user.auth_token and user.id to skip needing email/password later.

const rides = await client.getRides();

// Or provide a userId for a different user.
const otherUsersRides = await client.getRides({ userId: 123456 });

// Can also provide paging params.
const pageOfRides = await client.getRides({ offset: 20, limit: 10 });

// Can also refetch the user.
const refetchedUser = await client.getUser();

// Reuse auth token to skip authentication.
const newClient = new RideWithGPSClient('api-key', authToken, userId);
```
