/**
 * A generic model that our Master-Detail pages list, create, and delete.
 *
 * 
 */
export class Item {

  constructor(private fields: any) {
    // Quick and dirty extend/assign fields to this model
    for(let f in fields) {
      this[f] = fields[f];
    }
  }

}
