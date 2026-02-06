import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { hasAtLeast } from '../auth/roles';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = computed(() => this.auth.username() ?? 'user');
  role = computed(() => this.auth.role());

  showAudit = computed(() => hasAtLeast(this.auth.role(), 'OWNER'));

  logout() {
    this.auth.clear();
    this.router.navigateByUrl('/login');
  }
}
