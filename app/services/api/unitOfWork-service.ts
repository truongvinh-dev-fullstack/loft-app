import { ApisauceInstance, create } from "apisauce"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import { UserApi } from "./user-api"
/**
 * Manages all requests to the API.
 */
export class UnitOfWorkService {
  private _userApi: UserApi
  private apisauce: ApisauceInstance
  /**
   * Configurable options.
   */
  private config: ApiConfig = DEFAULT_API_CONFIG

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor() {
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
      //headers: {
      //  "Content-Type": "application/json",
      //  "Origin": "http://192.168.1.32:5051",
      //},
    })
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  get user(): UserApi {
    if (this._userApi == null) {
      return (this._userApi = new UserApi(this.apisauce))
    }
    return this._userApi
  }
}
