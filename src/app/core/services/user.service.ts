import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { User } from "../models/auth.models";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class UserProfileService {
  devBaseUrl = "http://127.0.0.1:5000";
  prodBaseUrl = "http://139.162.9.198:1111";
  private videoUrl = "http://127.0.0.1:5000/videos/sample1.mp4";
  bookValidateName: any;
  imageNames: any;

  constructor(private http: HttpClient) {}
  //video annotation
  getVideoFileName(): Observable<string> {
    // Send an HTTP GET request to fetch the video file name
    return this.http.get<string>("http://127.0.0.1:5000/api/videos");
  }

  getVideo() {
    // Send an HTTP GET request to fetch the video file name
    return this.http.get<string>(this.videoUrl);
  }

  saveSliceData(data: any) {
    // console.log(data);
    const API_URL = this.prodBaseUrl + "/add_info";
    const apiRes = this.http.post(API_URL, data);
    return apiRes;
  }
  postPDF(data: any) {
    const apiUrl = this.prodBaseUrl + "/pdf-data/";
    const apiRes = this.http.post(apiUrl, data);
    return apiRes;
  }

  // saveInfo() {
  //   const API_URL = this.prodBaseUrl + "/insert_data";
  //   const apiRes = this.http.get(API_URL);
  //   return apiRes;
  // }

  fetchVideo() {
    const API_URL = this.prodBaseUrl + "/videolist";
    const apiRes = this.http.get(API_URL);
    return apiRes;
  }

  fetchAnnotateData(id: any) {
    const API_URL = this.prodBaseUrl + "/get_annotate_data/data=" + id;
    const apiRes = this.http.get(API_URL);
    console.log(apiRes);
    return apiRes;
  }

  getVideoUrl(videoName: string): string {
    return `${this.prodBaseUrl}/videos/${videoName}`;
  }

  sliceVideo(dataObj: any) {
    const API_URL = this.prodBaseUrl + "/slice_video";
    const apiRes = this.http.post(API_URL, dataObj);
    console.log(apiRes);
    return apiRes;
  }

  saveValidateData(data: any) {
    console.log(data);
    const API_URL = this.prodBaseUrl + "/insert_validate_data";
    const apiRes = this.http.post(API_URL, data);
    return apiRes;
  }
  // fetchAnnotateData(Video_id: any) {
  //   const API_URL = `${this.prodBaseUrl}/get_annotate_data/data=${Video_id}`;
  //   const apiRes = this.http.get(API_URL);
  //   return apiRes;
  // }
  //digitisation

  getAll() {
    return this.http.get<User[]>(`/api/login`);
  }

  register(user: User) {
    return this.http.post(`/users/register`, user);
  }
  getbooksData() {
    const API_URL = this.prodBaseUrl + "/fetch-books";
    const apiRes = this.http.get(API_URL);
    return apiRes;
  }
  getbooksDatabyName(inp: any) {
    const API_URL = this.prodBaseUrl + "/fetch-books/data=" + inp;
    const apiRes = this.http.get(API_URL);
    return apiRes;
  }

  videoName: any;
  videoID: any;
  name_video: any;
  image_names: any;
  video_name: any;
  image_Name: any;
  imgName: any;
  annData:any;

  displayImg(data: any) {
    const apiUrl = this.prodBaseUrl + "/display";
    const apiRes = this.http.post(apiUrl, data);

    return apiRes;
  }
  getFirstAssignImage(inp: any) {
    const apiUrl = this.prodBaseUrl + "/get_assigned_image/index=" + inp;
    const apiRes = this.http.get(apiUrl);
    return apiRes;
  }

  getannotateData(data:any){
    const apiUrl = this.prodBaseUrl + "/get_inserted_data";
    const apiRes = this.http.post(apiUrl,data);
    return apiRes;
  }

  updateStatus(data:any){
    const apiUrl = this.prodBaseUrl + "/update_annotated_status";
    const apiRes = this.http.post(apiUrl,data);
    return apiRes;
  }

  getdatabyid(inp:any){
    const apiUrl = this.prodBaseUrl + "/get_video_data/id="+inp;
    const apiRes = this.http.get(apiUrl);
    return apiRes;
  }
}
