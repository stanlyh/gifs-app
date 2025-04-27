import { Injectable, signal } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ScrollStateService {

  trendingScrollState = signal(0);

/*   pageScrollState: Record<string, number> = {
    'page1': 1000,
    'page2': 0,
    'aboutPage': 140,
    'page20': 10,
  } */

}
