import { Component, inject, signal } from '@angular/core';
import { GifListComponent } from "../../components/gif-list/gif-list.component";
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent {

  gifService = inject( GifService )
  gifs = signal<Gif[]>([])

  onSearch(query: string) {
    //console.log({ query });
    this.gifService.searchGifs(query).subscribe((resp) => {
      //console.log(resp);
      this.gifs.set(resp);
    });
  }
 }
