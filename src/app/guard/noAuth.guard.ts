import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FunctionsService } from '../shared/services/functions.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const funtionsService = inject(FunctionsService)
  if (localStorage.getItem('token')) {
    router.navigateByUrl('/core')
    return false
  } else {
    return true;
  }
};
