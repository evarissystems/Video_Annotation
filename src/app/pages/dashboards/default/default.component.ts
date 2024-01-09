import { Component, OnInit } from "@angular/core";
import { UserProfileService } from "src/app/core/services/user.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.scss"],
})
export class DefaultComponent implements OnInit {
  bookName: any;
  constructor(private data: UserProfileService, private router: Router) {}

  videos: any[] = [];

  retrievedValue!: any;
  usrName: any;
  usrId: any;
  role: any;
  bookId: any;
  assignDiv: boolean = false;
  selectedTask: any;
  annotatorDiv: boolean = false;
  validatorDiv: boolean = false;
  annotators: any[] = [];
  validators: any[] = [];
  selectedAnnotator: any;
  assignDate: any;
  deadline: any;
  messageText: any;
  selectedValidator: any;
  books: any[] = [];
  assignedBooks: any[] = [];
  tasks: any[] = [{ role: "Annotator" }, { role: "Validator" }];
  status = false;
  imageNames: any;
  tableVisible: boolean = true;
  videoAnnotator: boolean = true;
  videoValidator: boolean = false;

  ngOnInit(): void {
    // Retrieve a value from local storage
    
    this.retrievedValue = localStorage.getItem("currentUser");

    const jsonObject = JSON.parse(this.retrievedValue);
    this.usrName = jsonObject.first_name;
    this.usrId = jsonObject.id;
    this.role = jsonObject.role;
    // if(this.role=='annotator'){

    this.data.fetchVideo().subscribe((response: any) => {
      // const values=Object.values(response)
      // console.log(response);
      for (const values of response) {
        // console.log(values.status);
        this.videos.push(values);
      }

      // console.log(this.videos);
    });

    // }
    if (this.role == "videovalidator") {
      this.videoAnnotator = false;
      this.videoValidator = true;
    }
  }

  getCellValue(rowRef: any, rowIndex: number): void {
    const video = this.videos[rowIndex].bookName;
    this.data.videoName = video + ".mp4";

    // console.log(videoName);
    this.data.videoID = this.videos[rowIndex].pdfId;
    this.data.name_video = video;

    this.data.getFirstAssignImage(this.data.videoID ).subscribe((response: any) => {
      // this.data.bookValidateName = this.bookName;
      // console.log(response);
      this.data.image_names = response.img_data;
      console.log(response);
      this.data.getdatabyid(this.data.videoID ).subscribe((response:any)=>{
        // console.log(response)
        this.data.annData=response
        this.router.navigate(["/videoannotate"]);
      })

    });

  }

  getValValue(rowRef: any, rowIndex: number): void {
    const video = this.videos[rowIndex].bookName;
    this.data.videoName = video + ".mp4";

    // console.log(videoName);
    // console.log(this.videos[rowIndex].video_id);
    this.data.videoID = this.videos[rowIndex].pdfId;
    console.log(this.data.videoID);
    this.data.name_video = video;
    // console.log(this.data.name_video);

    this.data.getFirstAssignImage(this.data.videoID).subscribe((response: any) => {
      // this.data.bookValidateName = this.bookName;
      console.log(response);
      this.data.image_names = response.img_data;
      // console.log(response.img_data);
      this.router.navigate(["/videovalidate"]);
    });
  }
}
