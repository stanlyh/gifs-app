import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

import { environment } from '@environments/environment';
import { Gif } from '../interfaces/gif.interface';
import type { GiphyResponse } from '../interfaces/giphy.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { consumerPollProducersForChange } from 'node_modules/@angular/core/weak_ref.d-DWHPG08n';

const GIF_KEY = 'gifs';

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}'; //Record<string, gifs[]>
  const gifs = JSON.parse(gifsFromLocalStorage);
  console.log(gifs);
  return gifs;
}

/* {
  'snoopy': [gif1, gif2, gif3],
  'garfield': [gif1, gif2, gif3],
  'celeste': [gif1, gif2, gif3],
}

Record<string, Gif[]> */

@Injectable({providedIn: 'root'})
export class GifService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);  //[gif,gif,gif,gif,gif,gif,]
  trendingGifsLoading =  signal(false);
  private trendingPage = signal(0);

  //[[gif,gif,gif],[gif,gif,gif],[gif,gif,gif],]
  trendingGifGroup = computed<Gif[][]>(() => {
    const groups = [];
    for( let i = 0; i < this.trendingGifs().length; i += 3 ){
      groups.push(this.trendingGifs().slice(i, i + 3));
    }
    //console.log(groups);
    return groups
  })

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrendingGifs();
  }

  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString);

  });

  loadTrendingGifs() {

    if ( this.trendingGifsLoading() ) return;

    this.trendingGifsLoading.set(true);

    this.http.get<GiphyResponse>(`${ environment.giphyUrl }/gifs/trending`,{
      params:{
        api_key: environment.giphyApiKey,
        limit: 20,
      }
    })
    .subscribe((resp) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.set(gifs);
      this.trendingGifsLoading.set(false);
      //console.log( { gifs })
    });
  }

  //masonry
  loadTrendingMasonryGifs() {

    if ( this.trendingGifsLoading() ) return;

    this.trendingGifsLoading.set(true);




    this.http.get<GiphyResponse>(`${ environment.giphyUrl }/gifs/trending`,{
      params:{
        api_key: environment.giphyApiKey,
        limit: 20,
        offset: this.trendingPage() * 20
      }
    })
    .subscribe((resp) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.update(currentGifs => [
        ...currentGifs,
        ...gifs
      ]);
      this.trendingPage.update((page) => page + 1)

      this.trendingGifsLoading.set(false);
      //console.log( { gifs })
    });
  }

  searchGifs(query: string): Observable<Gif[]> {
    return this.http.
      get<GiphyResponse>(`${ environment.giphyUrl }/gifs/search`,{
        params:{
          api_key: environment.giphyApiKey,
          limit: 20,
          q: query,
        }
      })
      .pipe(
        map(({ data }) => data),
        map((items) => GifMapper.mapGiphyItemsToGifArray(items)),

        //Historial
        tap(  items => {
          this.searchHistory.update( history => ({
            ...history,
            [query.toLowerCase()]: items,
          }));
        })
      );

/*     .subscribe((resp) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      console.log({ search: gifs })
      return gifs;
    }); */
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }

}
