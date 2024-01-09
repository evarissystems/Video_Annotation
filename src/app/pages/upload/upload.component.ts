import { Component, ElementRef, ViewChild,OnInit, NgModule, Input } from '@angular/core';
import { UserProfileService } from 'src/app/core/services/user.service';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import Swal from "sweetalert2";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})

export class UploadComponent {
// @ViewChild('mycanvas', {static: true}) mycanvas!: ElementRef<HTMLImageElement>;
// @ViewChild('image', {static: true}) image!: ElementRef<HTMLImageElement>;
/*
@ViewChild('canvas') canvasRef!: ElementRef;
@Input() messageText!: string;
apiResponse:any;
messageVisibleImage: boolean = false;
messageVisible: boolean = false;
imgBtnlabel = 'Browse';
pdfBtnLabel='Browse';
constructor(
  public data:DataService, 
  private http: HttpClient
  ){}
  
private canvas!: HTMLCanvasElement;
private ctx!: CanvasRenderingContext2D ;
private rectangles: Rectangle[] = [];
// private currentLabel = 1;
// public label: string = '';
// private croppImages:string[]=[];

msg!:any;
myImage!:any;
name:any;
public text: string = '';
isDrawing = false;
responseData:any=[];
textData:any=[];
textValue!: string;
idValue!:string;
txtValue!:string;
bookName!:string;
description!:string;
dateEnter!:any;
pdfSrc!: any ;
thumbnailSrc!: string;
currentPage: number = 1;
totalPages: number = 0;
fileLoaded: boolean = false; 
isSubmitting:boolean=false;

ngAfterViewInit() {
  this.canvas = this.canvasRef.nativeElement;
  const context = this.canvas.getContext('2d');
  if (context) {
    this.ctx = context;
  } else {
    throw new Error('Unable to obtain 2D rendering context.');
  }
}


onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    
    this.loadPDF(file);
  }
}


loadPDF(file: File) {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.msg="";
    // this.pdfSrc = new file();
    this.pdfSrc=e.target?.result as string;
    
    this.fileLoaded = true; // Set fileLoaded to true when the file is loaded
  };
  reader.readAsDataURL(file);
  this.startTimer();
}
startTimer(): void {
  const durationInSeconds = 2; // Change this to the desired duration in seconds
  setTimeout(() => {
    this.fileLoaded = false;
  }, durationInSeconds * 1000);
}
// onPageChange() {
//   // Perform any action when the page slider changes here
//   // this.extractThumbnail();
// }
// onPDFLoaded(pdf: any) {
//   this.totalPages = pdf.numPages;
//   // this.extractThumbnail();
// }


sendPdf(){
  this.isSubmitting = true;
  this.fileLoaded=false;
  const dataObj={
    //data:this.rectangles,
    pdf:this.pdfSrc,
    // name:this.name,
    projectName:this.txtValue,
    imgid:this.bookName
    // crop:this.croppImages
  }
  
  this.data.postPDF(dataObj).subscribe((response: any)=>{
    // console.log('Data sent successfully:', response);
  // Handle the response from the server
  this.messageText=response.message;
    if (this.messageText!="") {
      this.messageVisible = true;
    }
    else{
      this.messageVisible = true;
      this.messageText=" Something went wrong ";      
    }
});
this.setTimeout();
}
setTimeout(): void {
  const durationInSeconds = 5; // Change this to the desired duration in seconds
  setTimeout(() => {
    this.messageVisible = false;
    this.txtValue='';
    this.bookName='';
    this.pdfSrc='';
  }, durationInSeconds * 1000);
}
sendImage(){
  // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // console.log(this.inputValue);
    const dataObj={
      //data:this.rectangles,
      img:this.myImage.src,
      name:this.name,
      projectName:this.textValue,
      imgid:this.idValue
      // crop:this.croppImages
    }
    // console.log(dataObj);
    this.data.postImage(dataObj).subscribe((response: any)=>{
      // console.log('Data sent successfully:', response);
    // Handle the response from the server
    this.messageText=response.message;
    if (this.messageText!="") {
      this.messageVisibleImage = true;
    }
    // else{
    //   this.messageVisibleImage = true;
    //   this.messageText=" Something went wrong ";      
    // }
  });
  this.setOutTime();
}
setOutTime(): void {
  const durationInSeconds = 10; // Change this to the desired duration in seconds
  setTimeout(() => {
    this.messageVisibleImage = false;
    this.textValue='';
    this.idValue='';
    this.myImage.src='';
    this.clearCanvas();
  }, durationInSeconds * 1000);
}

handleUpload(event: any) {
  // this.clearCanvas();
  this.rectangles = [];
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  const reader = new FileReader();
  reader.readAsDataURL(event.target.files[0]);
  const file=event.target.files[0];
  // console.log(file)
  this.name=file['name'];
  // console.log(name);
  reader.onload=(event)=>
  {
    this.msg="";
    this.myImage = new Image();
    this.myImage.src=event.target?.result as string;
    // const context=this.canvas.nativeElement.getContext('2d');
    // console.log(myImage.src);
    this.myImage.onload=()=>
    {
      this.ctx.drawImage(this.myImage,0,0,this.canvas.width,this.canvas.height);
      // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
clearCanvas(): void {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
}

}
*/
loading:boolean=false;
apiResponse:any;
messageVisibleImage: boolean = false;
messageVisible: boolean = false;

imgBtnlabel = 'Browse';
pdfBtnLabel='Browse PDF';
videoBtnLabel='Browse Video';
  messageText: any;
constructor(
  public data:UserProfileService, 
  private http: HttpClient
  ){}
  msg!:any;
  myImage!:any;
  name:any;
  public text: string = '';
  isDrawing = false;
  responseData:any=[];
  textData:any=[];
  textValue!: string;
  idValue!:string;
  txtValue!:string;

  bookName!:string;
  year:any;
  sessionId:any;
  volume:any;
  number:any;
  pages:any;
  dateEnter!:any;

  description!:string;
  pdfSrc!: any ;
  thumbnailSrc!: string;
  currentPage: number = 1;
  totalPages: number = 0;
  fileLoaded: boolean = false; 
  isSubmitting:boolean=false;
  selectedFiles: File[] = [];    
  videofileData:File;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    // console.log(this.selectedFiles);
    this.fileLoaded = true; 
    if (file) {
      this.loadPDF(file);
    }
  }
  videoName:any;
  file_name:any;
  loadPDF(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.msg="";
      // this.pdfSrc = new file();
      this.pdfSrc=e.target?.result as string;
      // console.log(this.pdfSrc);
      this.file_name=file['name'];
      this.fileLoaded = true; // Set fileLoaded to true when the file is loaded
    };
    reader.readAsDataURL(file);
    this.startTimer();
  }
  startTimer(): void {
    const durationInSeconds = 10; // Change this to the desired duration in seconds
    setTimeout(() => {
      this.fileLoaded = false;
    }, durationInSeconds * 1000);
  }
  onvideoSelect(event:any){
    this.videofileData=event.target.files[0];
    this.videoName=this.videofileData['name']
  }
  // onPageChange() {
  //   // Perform any action when the page slider changes here
  //   // this.extractThumbnail();
  // }
  // onPDFLoaded(pdf: any) {
  //   this.totalPages = pdf.numPages;
  //   // this.extractThumbnail();
  // }
  
  projectID=1;
  sendPdf(){
    // this.loading=true;
    this.isSubmitting = true;
    this.fileLoaded=false;
    const dataObj=
    {
      //data:this.rectangles,
      // pdf:this.pdfSrc,
      // id:this.name,
      bookName:this.bookName,
      year:this.year,
      sessionId:this.sessionId,
      volume:this.volume,
      number:this.number,
      pages:this.pages,
      date:this.dateEnter,
      projectID:this.projectID,
      // vid:this.videofileData
      // crop:this.croppImages
    }
    // if (this.selectedFiles.length === 0) {
    //   return;
    // }
    // const fileData = new FormData();
    // for (let i = 0; i < this.selectedFiles.length; i++) {
    //   fileData.append('files', this.selectedFiles[i]); 
    //   fileData.append('json', JSON.stringify(dataObj));     
    //   console.log(fileData)
    // }
    // // console.log(fileData)
    // this.isSubmitting = true;
    // this.fileLoaded=false;    
    console.log(dataObj);
    Swal.fire({
      title: "Are you sure you want save?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) {
    this.data.postPDF(dataObj).subscribe((response: any)=>{
      // if(response){
      //   this.loading=false;
      // }
      // console.log('Data sent successfully:', response);
    // Handle the response from the server
    this.messageText=response.message;
    // alert(this.messageText)
      if (this.messageText!="") {
        // this.messageVisible = true;
        Swal.fire("Saved!", "Your data has been saved.", "success");
      }
      else{
        this.messageVisible = true;
        this.messageText=" Something went wrong ";      
      }
  });
}
});
  // this.setTimeout();
  }
  setTimeout(): void {
    const durationInSeconds = 5; // Change this to the desired duration in seconds
    setTimeout(() => {
      this.messageVisible = false;
      this.txtValue='';
      this.bookName='';
      this.pdfSrc='';
    }, durationInSeconds * 1000);
  }

  setOutTime(): void {
    const durationInSeconds = 10; // Change this to the desired duration in seconds
    setTimeout(() => {
      this.messageVisibleImage = false;
      this.textValue='';
      this.idValue='';
      this.myImage.src='';
    
    }, durationInSeconds * 1000);
  }
  
  confirm() {
    Swal.fire({
      title: "Are you sure you want save?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) {

        // Swal.fire("Saved!", "Your file has been saved.", "success");

      }
    });
  }



}