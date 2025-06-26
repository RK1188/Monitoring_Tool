import { TestBed } from '@angular/core/testing';

import { ApiTraceInterceptor } from './api-trace.interceptor';

describe('ApiTraceInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ApiTraceInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ApiTraceInterceptor = TestBed.inject(ApiTraceInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
