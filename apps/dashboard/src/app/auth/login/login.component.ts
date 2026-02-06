import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

type LoginResponse = { access_token: string };

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  showPassword = false;

  loading = false;
  message: string | null = null;

  isAuthed = computed(() => this.auth.isAuthed());

  ngOnInit(): void {
    if (this.auth.isAuthed()) {
      this.router.navigateByUrl('/');
    }
  }

  submit() {
    this.loading = true;
    this.message = null;

    this.auth.login(this.username, this.password).subscribe({
      next: (res: LoginResponse) => {
        this.auth.setToken(res.access_token);
        this.loading = false;
        this.router.navigateByUrl('/');
      },
      error: (err: unknown) => {
        this.loading = false;

        const msg =
          typeof err === 'object' && err && 'error' in err
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (err as any).error?.message || 'Login failed'
            : 'Login failed';

        this.message = msg;
      },
    });
  }
}
