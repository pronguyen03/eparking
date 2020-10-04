import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../shared/models/user';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  loading = false;
  users: User[];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loading = true;
    this.userService
      .getAll()
      .pipe(first())
      .subscribe(
        (users) => {
          this.loading = false;
          this.users = users;
        },
        (err) => {
          console.error(err);
        }
      );
  }
}
