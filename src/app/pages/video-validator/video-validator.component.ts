import { Component, ElementRef, ViewChild } from "@angular/core";
import { UserProfileService } from "src/app/core/services/user.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { LanguageService } from "src/app/core/services/language.service";

@Component({
  selector: "app-video-validator",
  templateUrl: "./video-validator.component.html",
  styleUrls: ["./video-validator.component.scss"],
})
export class VideoValidatorComponent {
  @ViewChild("videoElement", { static: true })
  videoElement!: ElementRef;
  @ViewChild("startTimeInput", { static: true })
  startTimeInput!: ElementRef;
  @ViewChild("canvas") canvasRef: ElementRef;
  myForm: FormGroup;
  loading:boolean=false;
  // responseData: any = [];
  annotateData: any = [];
  Video_id: any;
  isPlaying: boolean = false;
  isDisabled: boolean = true;
  currentTime: any;
  endCurrentTime: any;
  retrievedValue: any;
  currentIndex: number = 0;
  image_Name: any;
  videoPlayer: any;
  start_time: any;
  end_time: any;
  myImage: HTMLImageElement;
  imageName: any;
  video_Name: any;
  pageNo:any;
  name: any;
  videoUrl: SafeResourceUrl;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  annotateImg: boolean = true;
  // private rectangles: Rectangle[] = [];
  imgName: any;
  subject: any;
  question: any;
  keyPerson1: any;
  keyPerson2: any;
  location: any;
  tag2: any;
  annotateIndex: number = 0;
  video_src: any;
  savedDataList: any[] = [];
  isChecked: boolean = false;
  checkboxStatus: string = "Not Done";
  textarea: any;
  pageIndex: number = 1;
  sliceVideoUrl: "http://127.0.0.1:5000";
  nextannClicked:boolean=false;
  previousannClicked:boolean=false;
  totalAnnotation
  totalImages: any;
  nextbuttonClicked: boolean = false;
  previousbuttonClicked: boolean = false;
  usrName: any;
  usrId: any;
  public isUserSpeaking: boolean = false;
  
  constructor(
    private data: UserProfileService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private voiceRecognition:LanguageService
  ) {
    // ) {
    //   this.myForm = this.fb.group({
    //     subject: ["", [Validators.required]],
    //     question: ["", [Validators.required]],
    //     keyPerson1: ["", [Validators.required]],
    //     keyPerson2: ["", [Validators.required]],
    //     location: ["", [Validators.required]],
    //     tag2: ["", [Validators.required]],
    //   });
  }

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    // this.canvas2 = this.canvasRef2.nativeElement;
    const context = this.canvas.getContext("2d");
    if (context) {
      this.ctx = context;
    } else {
      throw new Error("Unable to obtain 2D rendering context.");
    }
    // this.search();
    // this.nextImage();
  }

  ngOnInit(): void {
    this.image_Name = this.data.image_names;
    this.Video_id = this.data.videoID;
    this.video_Name = this.data.name_video;
    // console.log(this.Video_id);
    this.video_src = this.data.videoName;
    const url = this.data.getVideoUrl(this.video_src);
    // console.log(url);
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // this.fetchData();
    this.fetchData();
    // this.getImageData();

    try {
      this.retrievedValue = localStorage.getItem("currentUser");
      console.log(this.retrievedValue);
      if (this.retrievedValue !== null) {
        // Value exists in local storage
        console.log(typeof this.retrievedValue);
      } else {
        // Key doesn't exist in local storage
        console.log("Key not found.");
      }
    } catch (error) {
      // Handle exceptions (e.g., local storage is disabled)
      console.error("Error accessing local storage:", error);
    }
    const jsonObject = JSON.parse(this.retrievedValue);
    this.usrName = jsonObject.first_name;
    this.usrId = jsonObject.id;

    this.totalImages=this.image_Name.length
    if (this.totalImages > 1) {
      this.nextbuttonClicked = true;
    }

  }
  // trackByFn(index: any, item: any): any {
  //   return item.start_time;
  //   return item.end_time;
  // }

  fetchData() {
    this.data.fetchAnnotateData(this.Video_id).subscribe((response: any) => {
      console.log(response.length);
      this.totalAnnotation=response.length; 
      if (this.totalAnnotation > 1) {
        this.nextannClicked = true;
      }   
      this.annotateData = response;
      const annData = response[this.annotateIndex];
      this.start_time = annData.start_time;
      this.end_time = annData.end_time;
      this.subject = annData.s;
      this.question = annData.q;
      this.keyPerson1 = annData.kp1;
      this.keyPerson2 = annData.kp2;
      this.location = annData.l;
      this.pageNo=annData.pagenumber;
      this.name=annData.imgName;
      this.currentIndex=this.image_Name.indexOf(this.name)
      this.seekTo();
      this.getImageData();
    });
    if (this.totalAnnotation > 1) {
      this.nextannClicked = true;
    }
    // this.seekTo();
  }

  getImageData() {
    // this.currentIndex = 0;
    // console.log(this.image_Name);
    this.name = this.image_Name[this.currentIndex];
    // console.log(this.name);

    // if (this.currentIndex < this.totalImages) {
      this.loading=true;
    const dataObj = {
      bookName: this.video_Name,
      imgName: this.name,
    };
    // console.log(dataObj);
    this.data.displayImg(dataObj).subscribe((response: any) => {
      // console.log(response);
      if(response){
        this.loading=false;
      }
      this.myImage = new Image();
      this.myImage.src = "data:image/jpeg;base64," + response;
      // Reset the rectangles array
      // this.clearCanvas();
      // const context=this.canvas.nativeElement.getContext('2d');
      // console.log(myImage.src);
      this.myImage.onload = () => {
        this.ctx.drawImage(
          this.myImage,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
      };
    });
  }
  nextImageData() {

    this.currentIndex++;
    // this.previousbuttonClicked = true;
    if (this.totalImages == 1) {
      this.previousbuttonClicked = false;
    } else {
      this.previousbuttonClicked = true;
    }
    if (this.currentIndex === this.totalImages - 1) {
      this.nextbuttonClicked = false;
      // this.spinner.hide();
    }
    this.getImageData();


  }

  previousImageData() {
    this.currentIndex=this.currentIndex - 1;
    // if (this.currentIndex === this.totalImages) {
    //   this.nextbuttonClicked = false;
    //   // this.spinner.hide();
    // }

    if (this.currentIndex === 0) {
      this.previousbuttonClicked = false;
    }
    if (this.currentIndex === this.totalImages - 1) {
      this.nextbuttonClicked = false;
      // this.spinner.hide();
    }
    this.getImageData();

  }

  onCheckboxChange(): void {
    if (this.isChecked) {
      console.log("checked");
      this.checkboxStatus = "Done";
    } else {
      console.log("Checkbox is not checked");
      this.checkboxStatus = "Not Done";
    }
  }
  status;
  saveValidation() {
    this.status="In Progress"

    Swal.fire({
      title: 'Are you sure?',
      // text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, save it!'
    }).then(result => {
      if (result.value) {
    // console.log(data);
    this.loading=true;
    const data = {
      video_id: this.Video_id,
      videoName: this.video_Name,
      start_time: this.start_time,
      end_time: this.end_time,
      subject: this.subject,
      question: this.question,
      keyPerson1: this.keyPerson1,
      keyPerson2: this.keyPerson2,
      location: this.location,
      checkbox: this.checkboxStatus,
      textarea: this.textarea,
      Page_no:this.pageNo,
      Add_link:
      "http://139.162.9.198:1111/" +
        this.video_Name +
        "/" +
        this.video_Name +
        "_" +
        this.pageIndex +
        ".mp4",
      Status:this.status,
      annId:this.pageIndex,
      imgName:this.name
    };
    // console.log(data)
    const myObj = {
      start_time: this.start_time,
      end_time: this.end_time,
      Slice_Video_name: this.video_Name + "_" + this.pageIndex + ".mp4",
    };
    this.data.saveValidateData(data).subscribe((response: any) => {
      console.log(response);
      this.loading=false;
      
      // alert(response);
      // alert(" Data Saved Successfully");
  
      if(response.message=="Data inserted successfully"){
        this.pageIndex++;
        this.isChecked=false;
        Swal.fire('Saved!', 'Validated data has been saved.', 'success');
      }
      else{
        alert(response.error)
    }
    // console.log(data);
    this.savedDataList.push(myObj);
    // console.log(this.savedDataList);

  });
}
    });
  }

  nextAnnotateData() {
    this.loading=true;
    this.onCheckboxChange();
    this.textarea="";
    this.annotateIndex++;
    if (this.totalAnnotation == 1) {
      this.previousannClicked = false;
    } else {
      this.previousannClicked = true;
    }
    if (this.annotateIndex === this.totalAnnotation - 1) {
      this.nextannClicked = false;
      // this.spinner.hide();
    }
    const annData = this.annotateData[this.annotateIndex];
    // console.log(annData);
    this.start_time = annData.start_time;
    this.end_time = annData.end_time;
    this.subject = annData.s;
    this.question = annData.q;
    this.keyPerson1 = annData.kp1;
    this.keyPerson2 = annData.kp2;
    this.location = annData.l;
    this.name=annData.imgName;
    this.pageNo=annData.pagenumber;
    this.currentIndex=this.image_Name.indexOf(this.name)
    this.seekTo();
    const dataObj = {
      bookName: this.video_Name,
      imgName: this.name,
    };
    // console.log(dataObj);
    this.data.displayImg(dataObj).subscribe((response: any) => {
      // console.log(response);
      this.loading=false;
      this.myImage = new Image();
      this.myImage.src = "data:image/jpeg;base64," + response;
      // Reset the rectangles array
      // this.clearCanvas();
      // const context=this.canvas.nativeElement.getContext('2d');
      // console.log(myImage.src);
      this.myImage.onload = () => {
        this.ctx.drawImage(
          this.myImage,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
      };
    });
  }

  previousAnnotateData() {
    this.annotateIndex=this.annotateIndex-1
    if (this.annotateIndex === 0) {
      this.previousannClicked = false;
    }
    if (this.annotateIndex === this.totalAnnotation - 1) {
      this.nextannClicked = false;
      // this.spinner.hide();
    }
    this.loading=true;
    this.onCheckboxChange();
    this.textarea="";
    const annData = this.annotateData[this.annotateIndex];
    this.start_time = annData.start_time;
    this.end_time = annData.end_time;
    this.subject = annData.s;
    this.question = annData.q;
    this.keyPerson1 = annData.kp1;
    this.keyPerson2 = annData.kp2;
    this.location = annData.l;
    this.name=annData.imgName;
    this.pageNo=annData.pagenumber;
    this.currentIndex=this.image_Name.indexOf(this.name)
    this.seekTo();
    const dataObj = {
      bookName: this.video_Name,
      imgName: this.name,
    };
    // console.log(dataObj);
    this.data.displayImg(dataObj).subscribe((response: any) => {
      // console.log(response);
      this.loading=false;
      this.myImage = new Image();
      this.myImage.src = "data:image/jpeg;base64," + response;
      // Reset the rectangles array
      // this.clearCanvas();
      // const context=this.canvas.nativeElement.getContext('2d');
      // console.log(myImage.src);
      this.myImage.onload = () => {
        this.ctx.drawImage(
          this.myImage,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
      };
    });
  }
  sliceData() {
    this.loading=true;
    this.status="Done"
    const slice_data = {
      dataObj: this.savedDataList,
      video_folder_name: this.video_Name,
      VideoName: this.video_src,
      status:this.status
    };
    this.data.sliceVideo(slice_data).subscribe((response) => {
      this.loading=false;
      console.log(response);
      const res=Object.values(response)[0]
      alert(res);
      this.router.navigate(["/dashboard"]);
    });
  }

  playPause() {
    const video = this.videoElement.nativeElement;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
  seekTo(): void {
    if (this.videoElement.nativeElement) {
      this.videoElement.nativeElement.currentTime = this.start_time;
    }
    // this.playPause();
  }
  // playVideo() {
  //   this.videoElement.nativeElement.play();
  //   this.isPlaying = true;
  // }

  // pauseVideo() {
  //   this.videoElement.nativeElement.pause();
  //   this.isPlaying = false;
  // }

  startButtonClick() {
    const video = this.videoElement.nativeElement as HTMLVideoElement;
    const currentTime = video.currentTime;
    this.isDisabled = false;
    // console.log(currentTime);
    // return this.currentTime.toFixed(2);
    const time=Math.floor(currentTime)
    
    this.start_time = time;
    // this.startBtnClick = false;
  }

  EndButtonClick() {
    const video = this.videoElement.nativeElement as HTMLVideoElement;
    const currentTime = video.currentTime;
    this.isDisabled = true;
    const time=Math.floor(currentTime)
    
    this.end_time = time;
    // this.startBtnClick = false;
  }

  formatTime(time): number {
    console.log(time)
    // const minutes = Math.floor(time / 60);
    // const seconds = Math.ceil(time % 60);
    // const milliseconds = Math.floor((time % 1) * 1000);
    // return `${minutes}:${String(seconds).padStart(2, "0")}:${String(
    //   milliseconds
    // ).padStart(3, "0")}`;
    const [seconds] = time.split('.').map(Number);
    return seconds;
  }

  stopRecording() {
    this.voiceRecognition.stop();
    this.isUserSpeaking = false;
  }
  
  initVoiceInput() {
    // Subscription for initializing and this will call when user stopped speaking.
    this.voiceRecognition.init().subscribe(() => {
      // User has stopped recording
      // Do whatever when mic finished listening
    });
  
    // Subscription to detect user input from voice to text.
    this.voiceRecognition.speechInput().subscribe((input) => {
      // Set voice text output to
      console.log(input)
      this.question=input;
    });
  
  }
  
  startRecording() {
    this.isUserSpeaking = true;
    this.voiceRecognition.start();
    this.question='';
  }
}
