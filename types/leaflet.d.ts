declare module "leaflet" {
  export = L
}

declare namespace L {
  export function map(element: string | HTMLElement, options?: any): any
  export function tileLayer(urlTemplate: string, options?: any): any
  export function marker(latlng: any, options?: any): any
  export function divIcon(options?: any): any
  export function featureGroup(layers?: any[]): any
  export namespace Icon {
    namespace Default {
      function mergeOptions(options: any): void
      const prototype: any
    }
  }
}

