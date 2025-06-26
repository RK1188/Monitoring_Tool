import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'MyApp'; 
   apiMessage = '';// ✅ Fix: add this line

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
   this.http.get<{ msg: string }>('/api/data').subscribe(
      (data) => {
        console.log('API Data:', data);
        this.apiMessage = data.msg; // 👈 set message
      },
      (error) => console.error('API Error:', error)
    );
  }
}
