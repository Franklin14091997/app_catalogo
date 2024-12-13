import { Injectable, Renderer2, RendererFactory2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../environments/environment';

declare var google: any;

@Injectable({
  providedIn: 'root',
})
export class GooglemapsService {
  private apiKey = environment.ApiKeyGoogleMaps;
  private mapsLoaded = false;
  private renderer: Renderer2;
  private loadingPromise: Promise<any> | null = null;

  constructor(rendererFactory: RendererFactory2, @Inject(DOCUMENT) private document: any) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  init(): Promise<any> {
    if (this.mapsLoaded) {
      return Promise.resolve(true);
    }

    if (this.loadingPromise) {
      return this.loadingPromise; // Retorna la promesa existente.
    }

    this.loadingPromise = new Promise((resolve, reject) => {
      const script = this.renderer.createElement('script');
      script.id = 'googleMaps';

      script.onload = () => {
        this.mapsLoaded = true;
        resolve(true);
      };

      script.onerror = (error: any) => {
        console.error('Error loading Google Maps script', error);
        reject(false);
      };

      script.src = this.apiKey
        ? `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=mapInit`
        : `https://maps.googleapis.com/maps/api/js?callback=mapInit`;

      this.renderer.appendChild(this.document.body, script);
    });

    return this.loadingPromise;
  }
}
