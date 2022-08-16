import { ApisauceInstance, ApiResponse } from "apisauce"
import { Platform } from "react-native"
import { API_URL, PORT, TIMEOUT } from "../../config"
import {useStores} from "../../models";
// import { Auth } from "./auth"
/**
 * Manages all requests to the API.
 * 
 */
 const {loft3DiModel} = useStores();

export class UserApi {
  private _apisauce: ApisauceInstance


  private _loft3DiModel = loft3DiModel
  // private _auth = new Auth()
  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(apisauce: ApisauceInstance) {
    this._apisauce = apisauce
  }


  // fixAvatar(avatar: any) {
  //   try {
  //     if (Platform.OS === "ios") {
  //       // avatar = avatar.replaceAll("\\", "/")
  //       // avatar = avatar.replaceAll(/\s/g, "%20")
  //       avatar = avatar.split("\\").join("/")
  //     }
  //     avatar = `${API_URL}:${PORT}/${avatar}`
  //     return avatar
  //   } catch (e) {
  //     // console.log(e)
  //     return null
  //   }
  // }
  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  async taoPhanBoTaiSan(payload: any): Promise<any> {
    const accessToken = await this._loft3DiModel?.userInfo?.token;
    const response = await this._apisauce.post(`api/asset/taoPhanBoTaiSan`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  async taoThuHoiTaiSan(payload: any): Promise<any> {
    const accessToken = await this._loft3DiModel?.userInfo?.token;
    const response = await this._apisauce.post(`api/asset/taoThuHoiTaiSan`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  async createOrUpdateBaoDuong(payload: any): Promise<any> {
    const accessToken = await this._loft3DiModel?.userInfo?.token;
    const response = await this._apisauce.post(`api/asset/createOrUpdateBaoDuong`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }


  // async forgotPassword(payload: any): Promise<any> {
  //   const response: ApiResponse<any> = await this._apisauce.post(`/user/forgorPassword`, payload)
  //   return response
  // }

  // async getUser(payload: any): Promise<any> {
  //   const response: ApiResponse<any> = await this._apisauce.post(`/user/getUser`, payload)
  //   return response
  // }

  // async getUserAvatarList(payload: any): Promise<any> {
  //   const response: ApiResponse<any> = await this._apisauce.post(`/user/getUserAvatarList`, payload)
  //   return response
  // }

  // // kova

  // async login(payload: any): Promise<any> {
  //   const response = await this._apisauce.post(`/Authenticate-worker`, payload)
  //   console.log(response);
  //   return response
  // }


  // async listHouseModel(payload: any): Promise<any> {
  //   const accessToken = await this._loft3DiModel?.userInfo?.token;
  //   const response = await this._apisauce.post(`/house-app/getMasterDataHouseModel`, payload,
  //     { headers: { "Authorization": `Bearer ${accessToken}` } })
  //   return response.data
  // }


}


