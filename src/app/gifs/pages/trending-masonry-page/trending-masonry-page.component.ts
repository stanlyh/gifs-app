import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifService } from '../../services/gifs.service';
import { consumerPollProducersForChange } from 'node_modules/@angular/core/weak_ref.d-DWHPG08n';

@Component({
  selector: 'app-trending-masonry-page',
  //imports: [GifListComponent],
  templateUrl: './trending-masonry-page.component.html',
})
export default class TrendingMasonryPageComponent {

  gifService = inject(GifService);

  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  onScroll( event: Event ) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if ( !scrollDiv ) return;

    const scrollTop =  scrollDiv.scrollTop;
    const clientHeight = scrollDiv.clientHeight;
    const scrollHeight = scrollDiv.scrollHeight;

    //console.log({ scrollTotal: scrollTop + clientHeight, scrollHeight })
    const isAtBottom = scrollTop + clientHeight + 300 >= scrollHeight;
    //console.log({isAtBottom});

    if ( isAtBottom ) {
      // TODO cargar next page
    }

  }
 }
