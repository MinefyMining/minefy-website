import {media} from './media-manifest.js?v=4152dfe81a';
const equipment=new Set(['haul','excavator','dozer','pickup','scroller']);
export function equipmentIcon(type){
 const name=equipment.has(type)?type:'haul',asset=media[`equipment/${name}`];
 return `<img class="equipment-render" src="${asset.src}" srcset="${asset.srcset}" sizes="150px" width="320" height="320" alt="" aria-hidden="true" loading="lazy" decoding="async">`;
}
