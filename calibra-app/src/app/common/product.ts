export class Product {
  constructor(
    public id: number,
    public name: string,
    public description: String,
    public unitPrice: number,
    public imageUrl: String,
    public active: boolean,
    public unitsInStock: number,
    public dateCreated: Date,
    public lastUpdated: Date
  ) {}
}
