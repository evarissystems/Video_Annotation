import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DefaultComponent } from "./dashboards/default/default.component";
import { VideoannotateComponent } from "./videoannotate/videoannotate.component";
import { VideoValidatorComponent } from "./video-validator/video-validator.component";
import { UploadComponent } from "./upload/upload.component";
const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: DefaultComponent,
  },
  { path: "dashboard", component: DefaultComponent },
  {
    path: "dashboards",
    loadChildren: () =>
      import("./dashboards/dashboards.module").then((m) => m.DashboardsModule),
  },
  { path: "videoannotate", component: VideoannotateComponent },
  { path: "videovalidate", component: VideoValidatorComponent },
  {path:"upload",component:UploadComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
