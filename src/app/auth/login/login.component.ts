import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  requestLink: string = '/auth/register';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  get email() {
    return this.loginForm.controls['email'];
  }
  get password() {
    return this.loginForm.controls['password'];
  }

  loginUser() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const credentials = {
        email: email as string,
        password: password as string,
      };

      this.authService.login(credentials).subscribe(
        (response) => {
          if (response) {
            this.router.navigate(['/submit-request']);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Email or password is wrong',
            });
          }
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong',
          });
        }
      );
    }
  }
}
