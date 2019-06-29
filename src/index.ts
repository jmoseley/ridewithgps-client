import axios from "axios";

import * as types from "./types";
import { NoUserIdError, UnauthorizedError, HttpError } from "./errors";

const BASE_PATH = "https://www.ridewithgps.com";

export class RideWithGPSClient {
  private authToken?: string;
  private authenticatedUserId?: number;

  constructor(private apiKey: string, authToken?: string, userId?: number) {
    if (authToken && userId) {
      this.authToken = authToken;
      this.authenticatedUserId = userId;
    }
  }

  public async getRides({
    userId,
    offset,
    limit
  }: {
    userId?: number;
    offset?: number;
    limit?: number;
  } = {}) {
    if (!userId || !this.authenticatedUserId) {
      throw new NoUserIdError();
    }

    const result = await this.doRequest(
      `/users/${userId || this.authenticatedUserId}/trips.json`,
      {
        offset,
        limit
      }
    );

    const rides: types.BaseRide[] = result.data.results;

    return rides;
  }

  public async getUser() {
    const user: types.AuthenticatedUser = await this.doRequest(
      `/users/current.json`
    );

    return user;
  }

  public async authenticateUser(email: string, password: string) {
    const user: types.AuthenticatedUser = await this.doRequest(
      `/users/current.json`,
      {
        email,
        password
      }
    );
    this.authenticatedUserId = user.id;
    this.authToken = user.auth_token;

    return user;
  }

  private async doRequest(path: string, params: object = {}) {
    try {
      const result = await axios.get(`${BASE_PATH}${path}`, {
        params: {
          ...params,
          version: "2",
          apikey: this.apiKey,
          auth_token: this.authToken
        }
      });

      return result.data;
    } catch (error) {
      if (!error.response) {
        // Something happened, the request did not get sent.
        throw error;
      }

      if (error.response.status === 401) {
        throw new UnauthorizedError(error.message);
      }

      throw new HttpError(error.response.code, error.message);
    }
  }
}
