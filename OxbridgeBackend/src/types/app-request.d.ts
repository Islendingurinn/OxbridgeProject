import { Request } from 'express';
import User from '../database/model/User';
import Keystore from '../database/model/Keystore';

/**
  * Lists the types of possible requests to the API.
  * Most of the requests are ProtectedRequests, meaning
  * both an api key and an access token are required. 
  */

declare interface PublicRequest extends Request {
  apiKey: string;
}

declare interface RoleRequest extends PublicRequest {
  currentRoleCode: string;
}

declare interface ProtectedRequest extends RoleRequest {
  user: User;
  accessToken: string;
  keystore: Keystore;
}

declare interface Tokens {
  accessToken: string;
  refreshToken: string;
}