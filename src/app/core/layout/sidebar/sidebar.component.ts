import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  today = 'day';
  test:any = 'test';
  ngOnInit() {
    // this.today = `day${getDate(new Date())}`;
    // setTimeout(()=>{
    //   this.test = 'ltsok---from sidebar'
    // },5000);
    // setInterval(()=>{
    //   console.log('sidebar---',this.test)
    // }, 1000);

  }

}
