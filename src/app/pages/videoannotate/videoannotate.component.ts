import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { UserProfileService } from "src/app/core/services/user.service";
import { LanguageService } from "src/app/core/services/language.service";
// import { HttpClientModule } from "@angular/common/http";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// import { url } from "inspector";
import * as Tesseract from "tesseract.js";
import Swal from "sweetalert2";
import { Router } from "@angular/router";



interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  text:string;
  // isDragging:boolean
}
@Component({
  selector: "app-videoannotate",
  templateUrl: "./videoannotate.component.html",
  styleUrls: ["./videoannotate.component.scss"],
})
export class VideoannotateComponent {
  @ViewChild("videoElement", { static: true })
  videoElement!: ElementRef;
  @ViewChild("startTimeInput", { static: true })
  startTimeInput!: ElementRef;
  @ViewChild("canvas") canvasRef!: ElementRef;
  myForm: FormGroup;
  loading:boolean=false;
  videoUrl: any; // Adjust the video URL
  currentIndex:number = 0;
  isPlaying: boolean = false;
  isDisabled: boolean = true;
  isFill: boolean = true;
  currentTime: any;
  endCurrentTime: any;
  startTimeInSeconds: any;
  endTimeInSeconds: any;
  img_name: any;
  subject: any;
  question: any;
  keyPerson1: any;
  keyPerson2: any;
  location: any;
  tag2: any;
  pageNo:any;
  video_ID: number;
  video_Name: any;
  retrievedValue: any;
  usrName: any;
  usrId: any;
  editableTextElements: HTMLDivElement[] = [];
  imageName: any;
  imgList: any;
  totalImages: any;
  name: any;
  buttonClicked = false;
  bookName: any;
  myImage!: any;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  annotateImg: boolean = true;
  // private rectangles: Rectangle[] = [];
  private canvas2!: HTMLCanvasElement;
  requiredFields: string[];
  Slice_Video_name: any;
  pageIndex: number = 1;
  videoPlayer: any;
  start_time: any;
  videoSource: any;
  videoName: string;
  video_name: string;
  convertedStartTime: any;
  convertedEndTime: number;
  firstword: any;
  questionId:number=0;
  nextbuttonClicked: boolean = false;
  previousbuttonClicked: boolean = false;
  public isUserSpeaking: boolean = false;
  pageBtnEnble:boolean=true;
  rectBtnEnble:boolean=true;
  eraseBtn:boolean=false;
  cropBtn:boolean=false;

  constructor(
    private data: UserProfileService,
    // private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router,
    private voiceRecognition:LanguageService
  ) {
    // this.myForm = this.fb.group({
    //   subject: ["", [Validators.required]],
    //   question: ["", [Validators.required]],
    //   keyPerson1: ["", [Validators.required]],
    //   keyPerson2: ["", [Validators.required]],
    //   location: ["", [Validators.required]],
    //   tag2: ["", [Validators.required]],
    //   pageNo: ["", [Validators.required]],
    // });
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
    // this.canvas.removeEventListener("mousedown", this.onMouseDown.bind(this));  
  }

  ngOnInit() {
    // this.videoUrl = "http://127.0.0.1:5000/videos/" + this.data.videoName;
    this.video_ID = this.data.videoID;
    this.video_Name = this.data.name_video;
    this.imageName = this.data.image_names;
    const video_src = this.data.videoName;
    this.getImageData();
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
      // const name=retrievedValue!.first_name
    } catch (error) {
      // Handle exceptions (e.g., local storage is disabled)
      console.error("Error accessing local storage:", error);
    }
    const jsonObject = JSON.parse(this.retrievedValue);
    this.usrName = jsonObject.first_name;
    this.usrId = jsonObject.id;

    const url = this.data.getVideoUrl(video_src);
    // console.log(url);
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.totalImages = this.imageName.length;
    if (this.totalImages > 1) {
      this.nextbuttonClicked = true;
    }
    // const videoann=this.data.annData;
    // console.log(videoann)
    // const annList=videoann[videoann.length - 1];
    // this.pageIndex=annList[1]
    // this.name=annList[4]
    // this.endTimeInSeconds=annList[7]
    // if (this.videoElement.nativeElement) {
    //   this.videoElement.nativeElement.currentTime = this.endTimeInSeconds;
    // }
    // this.questionId=this.pageIndex++;
    this.initVoiceInput();
  }

  drawRect(){
    this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.pageBtnEnble=false;
    this.eraseBtn=true;
    this.cropBtn=true
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
      this.videoElement.nativeElement.currentTime = this.startTimeInSeconds;
    }
    this.playPause();
  }

  getImageData() {
    this.loading=true;
    this.pageBtnEnble=true;
    this.rectBtnEnble=true;
    this.eraseBtn=false;
    this.cropBtn=false;
    // console.log(this.imageName);
    this.name = this.imageName[this.currentIndex];
    // console.log(this.name);
    // console.log(this.video_Name);
    // if (this.currentIndex < this.totalImages) {
    const dataObj = {
      bookName: this.video_Name,
      imgName: this.name,
    };
    console.log(dataObj);
    this.data.displayImg(dataObj).subscribe((response: any) => {
      // console.log(response);
      if(response){
        this.loading=false;
        this.question="";
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
      // this.imgTotext();
      };
    });
    // }
  }
imgTotext(){
  this.rectBtnEnble=false;
  this.loading=true;
  Tesseract.recognize(
    this.myImage,
    'eng+hin+mar', // language
    // {
    //   logger: info => console.log(info),
    // }
  ).then(({ data: { text } }) => {
    // Process the extracted text
    // console.log('Extracted Text:', text);
    this.question=text
    this.loading=false;
  }); 

  this.subject="";
  this.pageNo="";
  this.keyPerson1="";
  this.keyPerson2="";      
}
  // clearCanvas(): void {
  //   // this.rectangles = [];
  //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
  //   // this.ctx2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
  // }

  playVideo() {
    this.videoElement.nativeElement.play();
    this.isPlaying = true;
  }

  pauseVideo() {
    this.videoElement.nativeElement.pause();
    this.isPlaying = false;
  }

  startButtonClick() {
    const video = this.videoElement.nativeElement as HTMLVideoElement;
    const currentTime = video.currentTime;
    // console.log(currentTime);
    // return this.currentTime.toFixed(2);
    this.currentTime = this.formatTime(currentTime);
    // this.startBtnClick = false;
    this.isDisabled = false;

    // const timeString = this.currentTime;
    // this.convertedStartTime = this.convertToSeconds(timeString);
    const time=Math.floor(currentTime)
    this.startTimeInSeconds = time;
    console.log(this.startTimeInSeconds);
  }

  EndButtonClick() {
    const video = this.videoElement.nativeElement as HTMLVideoElement;
    const currentTime = video.currentTime;
    // console.log(`End Time: ${this.formatTime(currentTime)}`);
    // console.log(currentTime);
    // return this.currentTime.toFixed(2);
    this.endCurrentTime = this.formatTime(currentTime);
    // this.startBtnClick = false;
    this.isDisabled = true;
    // const timeString = this.endCurrentTime;
    const time=Math.floor(currentTime)
    // this.convertedEndTime = this.convertToSeconds(timeString);
    this.endTimeInSeconds = time;

    console.log(this.endTimeInSeconds);
    video.pause();
  }
status:any;
  saveData() {    
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
    const data = {
      Video_id: this.video_ID,
      Slice_Video_name: this.video_Name + "_" + this.pageIndex + ".mp4",
      img_name: this.name,
      start_time: this.startTimeInSeconds,
      end_time: this.endTimeInSeconds,
      subject: this.subject,
      question: this.question,
      key_person1: this.keyPerson1,
      key_person2: this.keyPerson2,
      location: this.location,
      tag2: this.tag2,
      pageNo:this.pageNo,
      Status:this.status,
      annId:this.pageIndex
    };
    this.data.saveSliceData(data).subscribe((response: any) => {
      // console.log(response);
      // alert(response.message);
      if(response.message=="Data inserted successfully"){
        this.pageIndex++;
        this.questionId++;
        this.currentTime = "";
        this.endCurrentTime = "";
        this.subject = "";
        this.question = "";
        this.keyPerson1 = "";
        this.keyPerson2 = "";
        this.location = "";
        this.tag2 = "";
        this.pageNo="";
        this.startTimeInSeconds="";
        this.endTimeInSeconds="";
        Swal.fire('Saved!', 'Your file has been saved.', 'success');
        this.onclickPrevious=true
        if (this.currentIndex === this.totalImages) {
          this.nextbuttonClicked = false;
          // this.spinner.hide();
        }
      }
      else{
        alert(response.error)
      }
    });
  }
    // if (
    //   this.subject ||
    //   this.question ||
    //   this.keyPerson1 ||
    //   this.keyPerson2 ||
    //   this.location === ""
    // ) {
    //   alert("Please fill missing fields!");
    // } else {
    //   alert(" Data Inserted Successfully!");
    // }
    //exmpty form logic
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
    this.onclickPrevious=true;
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
    // console.log(this.imageName);
    // this.name = this.imageName[this.currentIndex];

    // // console.log(this.name);
    // console.log(this.video_Name);

    // // if (this.currentIndex < this.totalImages) {
    // const dataObj = {
    //   bookName: this.video_Name,
    //   imgName: this.name,
    // };
    // this.data.displayImg(dataObj).subscribe((response: any) => {
    //   // console.log(response);
    //   this.myImage = new Image();
    //   this.myImage.src = "data:image/jpeg;base64," + response;
    //   // Reset the rectangles array
    //   // this.clearCanvas();
    //   // const context=this.canvas.nativeElement.getContext('2d');
    //   // console.log(myImage.src);
    //   this.myImage.onload = () => {
    //     this.ctx.drawImage(
    //       this.myImage,
    //       0,
    //       0,
    //       this.canvas.width,
    //       this.canvas.height
    //     );
    //   };
    // });
    
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.ceil(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    return `${minutes}:${String(seconds).padStart(2, "0")}:${String(
      milliseconds
    ).padStart(3, "0")}`;
  }

  convertToSeconds(timeString: string): number {
    const [minutesPart, secondsPart, millisecondsPart] = timeString
      .split(":")
      .map(Number);
    const minutesInSeconds = minutesPart * 60;
    const seconds = secondsPart + millisecondsPart / 1000;
    const timeSeconds = minutesInSeconds + seconds;
    return minutesInSeconds + seconds;
  }

  confirm() {
    Swal.fire({
      title: "Are you sure you want to end annotation?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) {
        const data={
          status:"Done",
          video_id:this.video_ID
        }
        this.data.updateStatus(data).subscribe((response:any)=>{
          console.log(response)
          this.router.navigate(["/dashboard"]);
        }) 
        // Swal.fire("Saved!", "Your file has been saved.", "success");

      }
    });
  }

index
onclickNext:boolean=false;
onclickPrevious:boolean=false;
// annList:any[]=[]
nextAnnotateData(){
if(this.index==this.pageIndex){
  this.onclickNext=false;
}
else{
  this.index++
const dataObj={
  slicedNo:this.index,
  video_id:this.video_ID 
}
this.data.getannotateData(dataObj).subscribe((response: any) => {
// console.log(response);
for (const values of response) {
  this.name=values[4]
  this.startTimeInSeconds=values[6]
  this.endTimeInSeconds=values[7]
  this.question=values[8]
  this.subject=values[9]
  this.keyPerson1=values[10]
  this.keyPerson2=values[11]
  this.pageNo=values[14]
  this.currentIndex=this.imageName.indexOf(this.name)
}
this.getImageData();
this.seekTo();
});
}

}
previousAnnotateData(){
  this.onclickNext=true
  this.index=this.pageIndex
  this.index=this.index-1
  const dataObj={
    slicedNo:this.index,
    video_id:this.video_ID  
  }
  this.data.getannotateData(dataObj).subscribe((response: any) => {
    console.log(response);
    for (const values of response) {
      this.name=values[4]
      this.startTimeInSeconds=values[6]
      this.endTimeInSeconds=values[7]
      this.question=values[8]
      this.subject=values[9]
      this.keyPerson1=values[10]
      this.keyPerson2=values[11]
      this.pageNo=values[14]
      this.currentIndex=this.imageName.indexOf(this.name)
      }
      this.getImageData();
      this.seekTo();
    });
}

private rectangles: Rectangle[] = [];
private currentLabel = 1;
public label: string = '';
text:any;
rectHeight=10;
rectWidth=10;

// Rectangle drawn on canvas
onMouseDown(event: MouseEvent) { 
  // this.isDrawing = true;
  // console.log("Y");
  const startX = event.offsetX;
  const startY = event.offsetY;
  this.annotateImg=true;
  // if (this.myImage)
  this.text='';


  const drawRectangle = (e: MouseEvent) => {
    // if (!this.isDrawing) return;

    const width = e.offsetX - startX;
    const height = e.offsetY - startY;
  // For drag rectangle
    // const rectangle = this.rectangles[this.selectedRectangleIndex];
    // rectangle.x = startX - this.offsetX;
    // rectangle.y = startY - this.offsetY;

    // this.clearCanvas();
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.drawImage(this.myImage, 0, 0,this.canvas.width, this.canvas.height);  
    this.drawAllRectangles();
    this.drawSingleRectangle(startX, startY, width, height);
  };

  const handleMouseUp = (e: MouseEvent) => {
    // if (!this.isDrawing) return;
    // this.isDrawing = false;
    const width = e.offsetX - startX;
    const height = e.offsetY - startY;

    const rectangle: Rectangle = {
      x: startX,
      y: startY,
      width: width,
      height: height,
      label: this.currentLabel.toString(),
      text: this.text,
      // isDragging: false
    };

    if(rectangle.width>10&&rectangle.height>10){
    // if(rectangle.height>this.rectHeight && rectangle.width>this.rectWidth) {
    this.rectangles.push(rectangle);
     this.currentLabel++;
    }

    this.canvas.removeEventListener('mousemove', drawRectangle);
    this.canvas.removeEventListener('mouseup', handleMouseUp);
    // this.clearCanvas();
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.drawImage(this.myImage, 0, 0,this.canvas.width, this.canvas.height);  
    this.drawAllRectangles();
    // this.text='';
     
  };

  this.canvas.addEventListener('mousemove', drawRectangle);
  this.canvas.addEventListener('mouseup', handleMouseUp);  

}

clearCanvas(): void {
  this.rectangles = [];
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
  // this.drawSampleImage();
  // this.getImageData();
  this.ctx.drawImage(
    this.myImage,
    0,
    0,
    this.canvas.width,
    this.canvas.height
  );

}


drawAllRectangles() {
  this.rectangles.forEach(rectangle => {
    this.drawSingleRectangle(rectangle);
    
  });
}

drawSingleRectangle(rectangle: Rectangle | number, y?: number, width?: number, height?: number,text?:string) {
  
  let x: number;
  let label: string;
  // let txt:string;
  if (typeof rectangle === 'object') {
    x = rectangle.x;
    y = rectangle.y;
    width = rectangle.width;
    height = rectangle.height;
    label = rectangle.label;
    text=rectangle.text
  } else {
    x = rectangle as number;
    label = this.currentLabel.toString();
  }
  
if(typeof rectangle === 'object' && rectangle.height>this.rectHeight && rectangle.width>this.rectWidth){
  this.ctx.strokeStyle = 'red';
  this.ctx.lineWidth = 2;
  this.ctx.strokeRect(x, y as number, width as number, height as number);

  this.ctx.fillStyle = 'black';
  this.ctx.font = '16px sans-serif';
  this.ctx.fillText(label, x, (y as number) - 10);

  
  this.ctx.font = '14px sans-serif';
  this.ctx.fillText(text as string, x, (y as number) + (height as number)  + 20);
}
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

imgStr:any;
croppedData(){
  this.rectangles.forEach(rectangle=>{
  const imageData = this.ctx.getImageData(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = rectangle.width;
  croppedCanvas.height = rectangle.height;
  const croppedCtx = croppedCanvas.getContext('2d');
  
  // Draw the cropped portion on the new canvas
  croppedCtx!.putImageData(imageData, 0, 0);
  // Retrieve the cropped image as a data URL
  const croppedImageUrl = croppedCanvas.toDataURL();
  this.imgStr = croppedImageUrl.split(',')[1].trim();
  const myImage = new Image();
  myImage.src = "data:image/jpeg;base64," + this.imgStr;
  console.log(this.imgStr)
  Tesseract.recognize(
    myImage,
    'eng+hin+mar', // language
    // {
    //   logger: info => console.log(info),
    // }
  ).then(({ data: { text } }) => {
    // Process the extracted text
    // console.log('Extracted Text:', text);
    this.question=text
    this.loading=false;
  }); 

  })


// btn.addEventListener('click', () => {
//   sendData({ test: 'ok' });
// })
}
}
